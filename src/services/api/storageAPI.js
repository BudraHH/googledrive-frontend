import API from '../api';
import axios from 'axios';

// This service handles interactions with AWS S3 via backend pre-signed URLs

export const storageAPI = {

    uploadFile: async (file, onProgress, parentFolderId = null) => {
        try {
            console.log(`[AWS S3] Requesting upload URL for: ${file.name}`);

            // 1. Get the pre-signed URL from your backend
            const response = await API.post('/files/generate-upload-url', {
                fileName: file.name,
                fileType: file.type
            });

            const { uploadURL, fileKey } = response.data;
            console.log(`[AWS S3] Upload URL received. Uploading to: ${fileKey}`);

            // 2. Upload the file directly to S3 using the URL
            await axios.put(uploadURL, file, {
                headers: {
                    'Content-Type': file.type,
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(percentCompleted);
                    }
                }
            });

            console.log(`[AWS S3] Upload complete: ${fileKey}`);

            // 3. Save metadata to MongoDB via Backend
            const metadataResponse = await API.post('/files/metadata', {
                name: file.name,
                type: 'file',
                fileKey: fileKey,
                fileType: file.type,
                size: file.size,
                parentFolderId: parentFolderId // Passed from caller
            });

            console.log('[Backend] Metadata saved:', metadataResponse.data);

            return {
                success: true,
                item: metadataResponse.data.item
            };

        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    },

    // Placeholder for download (would request a signed GET url)
    downloadFile: async (fileId) => {
        console.warn("Download not yet implemented with backend signing.");
        return { success: false };
    },

    // Batch Operations
    batchGetUploadUrls: async (filesMetadata) => {
        const response = await API.post('/files/batch/generate-upload-urls', { files: filesMetadata });
        return response.data;
    },

    batchSaveMetadata: async (items) => {
        const response = await API.post('/files/batch/metadata', { items });
        return response.data;
    }
};
