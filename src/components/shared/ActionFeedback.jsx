import React from 'react';
import { useActionStore } from '@/stores/actionStore';
import { X } from 'lucide-react';

export default function ActionFeedback() {
    const { isLoading, message, endAction } = useActionStore();

    if (!isLoading) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[200] flex items-center gap-3 px-4 py-3 bg-[#1e1e1e] text-white rounded shadow-lg min-w-[150px] animate-in slide-in-from-bottom-2 fade-in duration-200">
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={endAction}
                className="ml-auto text-slate-400 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
}
