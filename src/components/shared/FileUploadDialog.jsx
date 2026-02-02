import { useState, useRef } from "react";
import { Upload, FileText, X, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileUploadDialog({ open, onOpenChange, onUpload }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);

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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = (newFiles) => {
        const fileList = Array.from(newFiles).map(file => ({
            file,
            name: file.name,
            size: (file.size / 1024).toFixed(0) + " KB",
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ", " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: "Ready"
        }));
        setFiles(prev => [...prev, ...fileList]);
    };

    const handleUploadClick = () => {
        onUpload(files.map(f => f.file));
        onOpenChange(false);
        setFiles([]);
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
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
                    <h2 className="text-lg font-semibold text-slate-800">Upload Files</h2>
                    <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Current Files List (Matching the "Ref" card style) */}
                    {files.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Selected Files
                            </h3>

                            <div className="space-y-3">
                                {files.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:border-blue-300 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{item.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>{item.date}</span>
                                                    <span>•</span>
                                                    <span>{item.size}</span>
                                                    <span>•</span>
                                                    <span className="text-emerald-600 font-medium">{item.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="danger" size="icon" className="hidden group-hover:flex" onClick={() => handleRemoveFile(idx)}>
                                            <Trash size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload Drop Zone (Matching the dashed area) */}
                    <div>
                        {files.length > 0 && (
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Add more files
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
                                multiple
                                onChange={(e) => handleFiles(e.target.files)}
                            />

                            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                <Upload className="h-7 w-7 text-brand-500" />
                            </div>

                            <h4 className="text-lg font-semibold text-slate-900 mb-1">
                                Click to upload or drag and drop
                            </h4>
                            <p className="text-sm text-slate-500">
                                PDF, Images, Video or Audio (Max 2GB)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                        {files.length} files selected
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-slate-200/50 text-slate-600">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadClick}
                            disabled={files.length === 0}
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
