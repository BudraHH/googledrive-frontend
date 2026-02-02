import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { storageAPI } from '@/services/api/storageAPI';
import { filesAPI } from '@/services/api/filesAPI';
import { useUploadStore } from '@/stores/uploadStore';
import axios from 'axios';

/*
  Advanced File Upload Hook with Batch Support and Concurrency Control
*/
export function useFileUpload(currentFolderId = null) {
    const [isDragging, setIsDragging] = useState(false);
    const { toast } = useToast();

    // --- Helper: Traverse File System Entry (Drag & Drop) ---
    const traverseFileTree = async (item, path = "", results = []) => {
        if (item.isFile) {
            const file = await new Promise((resolve) => item.file(resolve));
            // Add custom path property to match input file logic
            file.fullPath = path + item.name;
            results.push({ type: 'file', file, path: path }); // path is parent dir path
        } else if (item.isDirectory) {
            const dirPath = path + item.name;
            results.push({ type: 'folder', name: item.name, fullPath: dirPath, parentPath: path });

            const dirReader = item.createReader();
            const entries = await new Promise((resolve) => {
                dirReader.readEntries((entries) => resolve(entries));
            });

            for (const entry of entries) {
                await traverseFileTree(entry, dirPath + "/", results);
            }
        }
        return results;
    };

    // --- Unified Batch Logic for both Input and Drag ---
    const handleBatch = async (files, explicitFolders, rootParentId) => {
        const { addUploads, updateProgress, markAsError } = useUploadStore.getState();

        // Register files into store immediately with "pending" state
        // We use a temp ID for now
        const newUploads = files.map(f => ({
            id: f.tempId || Math.random().toString(36).substr(2, 9),
            name: f.name,
            progress: 0,
            status: 'pending',
            fileObj: f // Store ref to file if needed for retry?
        }));

        // Attach IDs back to file objects so we can reference them during process
        files.forEach((f, index) => {
            f.storeId = newUploads[index].id;
        });

        addUploads(newUploads);

        // Map: Path String -> Folder ID
        const folderIdMap = new Map(); // "subfolder/nested" -> "12345ID"
        folderIdMap.set("", rootParentId); // Root context

        // 1. Resolve Folders
        // Combine implicit folders from file paths and explicit folders
        const allPaths = new Set();

        // Helper to collect all needed folder paths from a file path
        const collectPaths = (filePath) => {
            const parts = filePath.split('/');
            parts.pop(); // remove file name
            if (parts.length === 0) return;

            let current = "";
            parts.forEach(part => {
                current = current ? `${current}/${part}` : part;
                allPaths.add(current);
            });
        };

        files.forEach(f => {
            const p = f.webkitRelativePath || f.fullPath;
            if (p) collectPaths(p);
        });

        const sortedPaths = Array.from(allPaths).sort((a, b) => a.length - b.length);

        // Create folders sequentially
        for (const path of sortedPaths) {
            if (folderIdMap.has(path)) continue;

            const parts = path.split('/');
            const name = parts.pop();
            const parentPath = parts.join('/');
            const parentId = folderIdMap.get(parentPath) || rootParentId;

            try {
                const newFolder = await filesAPI.createFolder(name, parentId);
                folderIdMap.set(path, newFolder._id || newFolder.id);
                // Small delay to be nice to rate limiter
                await new Promise(r => setTimeout(r, 50));
            } catch (err) {
                console.error(`Failed to create folder ${path}`, err);
            }
        }

        // 2. Batch Upload Files
        if (files.length === 0) return;

        // Chunk files for batch init (e.g. 50 at a time)
        const CHUNK_SIZE = 50;
        for (let i = 0; i < files.length; i += CHUNK_SIZE) {
            const fileChunk = files.slice(i, i + CHUNK_SIZE);

            try {
                // A. Init Batch
                const initPayload = fileChunk.map(f => ({
                    name: f.name,
                    type: f.type || 'application/octet-stream'
                }));

                const uploadUrls = await storageAPI.batchGetUploadUrls(initPayload);

                // B. Parallel Uploads to S3 (Limit concurrency per chunk)
                const uploadQueue = fileChunk.map((file, idx) => ({
                    file,
                    ...uploadUrls[idx] // contains uploadURL, fileKey
                }));

                const CONCURRENCY = 5;
                const processQueue = async () => {
                    const results = [];
                    const active = new Set();

                    for (const item of uploadQueue) {
                        while (active.size >= CONCURRENCY) {
                            await Promise.race(active);
                        }

                        // Start Upload
                        updateProgress(item.file.storeId, 1); // Started

                        const p = axios.put(item.uploadURL, item.file, {
                            headers: { 'Content-Type': item.file.type },
                            // Add progress tracking
                            onUploadProgress: (progressEvent) => {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                updateProgress(item.file.storeId, percentCompleted);
                            }
                        }).then(() => {
                            results.push(item);
                            active.delete(p);
                            updateProgress(item.file.storeId, 100);
                        }).catch(err => {
                            console.error("S3 Upload Failed", item.name, err);
                            markAsError(item.file.storeId, "Upload failed");
                            active.delete(p);
                        });

                        active.add(p);
                    }
                    await Promise.all(active);
                    return results;
                };

                const successfulUploads = await processQueue();

                // C. Finalize Metadata
                if (successfulUploads.length > 0) {
                    const metadataPayload = successfulUploads.map(item => {
                        // Find parent ID for this file
                        const pLink = item.file.webkitRelativePath || item.file.fullPath;
                        let parentId = rootParentId;
                        if (pLink) {
                            const parts = pLink.split('/');
                            parts.pop(); // remove filename
                            if (parts.length > 0) {
                                const dirPath = parts.join('/');
                                if (folderIdMap.has(dirPath)) {
                                    parentId = folderIdMap.get(dirPath);
                                }
                            }
                        }

                        return {
                            name: item.name,
                            type: 'file',
                            fileKey: item.fileKey,
                            fileType: item.file.type,
                            size: item.file.size,
                            parentFolderId: parentId
                        };
                    });

                    await storageAPI.batchSaveMetadata(metadataPayload);
                }

            } catch (err) {
                console.error("Batch failed", err);
                // Mark all in this chunk as failed if they aren't complete
                fileChunk.forEach(f => {
                    markAsError(f.storeId, "Batch failed");
                });
            }
        }

        // Final refresh
        window.dispatchEvent(new Event('refresh-files'));
    };


    const handleUpload = useCallback(async (items, folderIdOverride = null) => {
        const targetFolderId = folderIdOverride || currentFolderId;

        // 1. Input Element Files
        if (items instanceof FileList || (Array.isArray(items) && items[0] instanceof File)) {
            const files = Array.from(items);
            await handleBatch(files, [], targetFolderId);
            return;
        }

    }, [currentFolderId]);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const items = e.dataTransfer.items;
        if (!items) return;

        const entries = [];
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
            if (entry) entries.push(entry);
        }

        const flatFiles = [];

        for (const entry of entries) {
            const results = await traverseFileTree(entry);
            results.forEach(r => {
                if (r.type === 'file') {
                    flatFiles.push(r.file);
                }
            });
        }

        await handleBatch(flatFiles, [], currentFolderId);

    }, [currentFolderId]);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types && e.dataTransfer.types.indexOf('Files') !== -1) {
            setIsDragging(true);
        }
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    }, []);

    return {
        isDragging,
        dragProps: {
            onDragOver,
            onDragLeave,
            onDrop: handleDrop
        },
        handleUpload
    };
}
