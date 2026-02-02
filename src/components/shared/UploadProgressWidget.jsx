import React from 'react';
import { useUploadStore } from '@/stores/uploadStore';
import {
    X,
    ChevronDown,
    ChevronUp,
    File,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function UploadProgressWidget() {
    const {
        uploads,
        isVisible,
        isExpanded,
        toggleExpanded,
        closeWidget,
        removeUpload
    } = useUploadStore();

    if (!isVisible) return null;

    const inProgress = uploads.filter(u => u.status === 'pending' || u.status === 'uploading');
    const completed = uploads.filter(u => u.status === 'success');
    const failed = uploads.filter(u => u.status === 'error');

    const isFinished = inProgress.length === 0;

    // Header Text Logic
    let headerText = "";
    if (isFinished) {
        headerText = `${completed.length} uploads complete`;
        if (failed.length > 0) headerText += `, ${failed.length} failed`;
    } else {
        headerText = `Uploading ${inProgress.length} item${inProgress.length !== 1 ? 's' : ''}`;
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-t-lg shadow-2xl border border-slate-200 z-[100] flex flex-col transition-all duration-300 overflow-hidden font-sans">
            {/* Header */}
            <div
                className="h-14 bg-[#1f1f1f] text-white px-4 flex items-center justify-between cursor-pointer rounded-t-lg"
                onClick={toggleExpanded}
            >
                <div className="flex flex-col justify-center">
                    <span className="font-medium text-[15px]">{headerText}</span>
                    {/* Optional: overall progress bar could go here */}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleExpanded(); }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); closeWidget(); }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content List */}
            {isExpanded && (
                <div className="flex-1 bg-white max-h-80 overflow-y-auto custom-scrollbar">
                    {/* Wait Queue / In Progress / Completed */}
                    <div className="divide-y divide-slate-100">
                        {uploads.map((file) => (
                            <div key={file.id} className="group flex items-center gap-3 p-3 hover:bg-slate-50 relative">
                                {/* Icon based on Type/Status */}
                                <div className="flex-shrink-0 text-slate-500">
                                    {/* Usually generic File icon, or mime type specific */}
                                    <File size={20} />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-700 font-medium truncate" title={file.name}>
                                            {file.name}
                                        </span>
                                    </div>

                                    {/* Progress Bar / Status */}
                                    <div className="flex items-center justify-between gap-3">
                                        {(file.status === 'uploading' || file.status === 'pending') && (
                                            <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-500 transition-all duration-300"
                                                    style={{ width: `${Math.max(5, file.progress)}%` }} // Min 5% to show active
                                                />
                                            </div>
                                        )}

                                        {/* Status Text/Icon */}
                                        <div className="text-xs text-slate-500 flex-shrink-0">
                                            {file.status === 'pending' && 'Queued'}
                                            {file.status === 'uploading' && `${Math.round(file.progress)}%`}
                                            {file.status === 'success' && <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={14} /> Complete</span>}
                                            {file.status === 'error' && <span className="text-red-600 flex items-center gap-1"><AlertCircle size={14} /> Error</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Action: Cancel/Remove */}
                                {(file.status === 'success' || file.status === 'error') && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex pl-2 bg-gradient-to-l from-slate-50 via-slate-50 to-transparent">
                                        <button
                                            onClick={() => removeUpload(file.id)}
                                            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
