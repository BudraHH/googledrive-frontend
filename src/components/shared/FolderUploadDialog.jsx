import { useState, useRef } from "react";
import { FolderUp, Folder, X, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FolderUploadDialog({ open, onOpenChange, onUpload }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [folders, setFolders] = useState([]);

    if (!open) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        // Note: Dragging folders often results in files. Proper folder parsing from DnD is complex (FileSystemEntry API).
        // For this simple implementation, we'll try to process what we get, but usually DnD gives files.
        // We'll rely on the Input picker for guaranteed folder selection structure.
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const processFiles = (fileList) => {
        const files = Array.from(fileList);
        if (files.length === 0) return;

        // Try to determine folder name from webkitRelativePath
        // If uploaded via folder picker, webkitRelativePath is set: "FolderName/file.txt"
        // If dragged, it might vary or just be flat files depending on browser.

        const firstFile = files[0];
        const path = firstFile.webkitRelativePath;

        let folderName = "Selected Files";
        let type = "files";

        if (path) {
            folderName = path.split('/')[0];
            type = "folder";
        } else {
            // If no relative path, it might be just files dragged. We can treat it as a "Drag Upload" batch.
            folderName = `Upload Batch (${files.length} items)`;
        }

        const newFolderItem = {
            id: Date.now(),
            name: folderName,
            fileCount: files.length,
            size: (files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2) + " MB",
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: "Ready",
            files: files // The actual payload
        };

        setFolders(prev => [...prev, newFolderItem]);
    };

    const handleUploadClick = () => {
        // Flatten all files from all folder items
        const allFiles = folders.flatMap(f => f.files);
        onUpload(allFiles);
        onOpenChange(false);
        setFolders([]);
    };

    const handleRemoveFolder = (id) => {
        setFolders(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 className="text-lg font-semibold text-slate-800">Upload Folders</h2>
                    <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Selected Folders List */}
                    {folders.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Selected Folders
                            </h3>

                            <div className="space-y-3">
                                {folders.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:border-blue-300 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Folder className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{item.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>{item.date}</span>
                                                    <span>•</span>
                                                    <span>{item.fileCount} files</span>
                                                    <span>•</span>
                                                    <span>{item.size}</span>
                                                    <span>•</span>
                                                    <span className="text-emerald-600 font-medium">{item.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="icon"
                                            className="hidden group-hover:flex"
                                            onClick={() => handleRemoveFolder(item.id)}
                                        >
                                            <Trash size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload Drop Zone */}
                    <div>
                        {folders.length > 0 && (
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Add more folders
                            </h3>
                        )}

                        <div
                            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-slate-50/50
                                ${isDragging ? 'border-brand-500 bg-brand-50/50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={inputRef}
                                className="hidden"
                                webkitdirectory=""
                                directory=""
                                multiple
                                onChange={(e) => processFiles(e.target.files)}
                            />

                            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                <FolderUp className="h-7 w-7 text-brand-500" />
                            </div>

                            <h4 className="text-lg font-semibold text-slate-900 mb-1">
                                Click to select folder
                            </h4>
                            <p className="text-sm text-slate-500">
                                Upload entire directories (Max 5000 files)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                        {folders.length} folders selected
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-slate-200/50 text-slate-600">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadClick}
                            disabled={folders.length === 0}
                            className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
