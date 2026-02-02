import { useEffect, useState, useRef } from 'react';
import { X, Download, MoreVertical, FileText, Printer, FolderInput, Star, Pencil, Search, Info, Shield, BellOff, ExternalLink, SlidersHorizontal, PlusSquare } from 'lucide-react';
import { usePreviewStore } from '@/stores/usePreviewStore';
import { filesAPI } from '@/services/api/filesAPI';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function FilePreviewModal() {
    const { previewFile, closePreview } = usePreviewStore();
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { toast } = useToast();

    useEffect(() => {
        if (previewFile) {
            loadPreview();
        } else {
            setDownloadUrl(null);
            setLoading(false);
        }
    }, [previewFile]);

    // Close menu on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMoreMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadPreview = async () => {
        setLoading(true);
        try {
            const id = previewFile.id || previewFile._id;
            const { downloadURL } = await filesAPI.getDownloadUrl(id);
            setDownloadUrl(downloadURL);
        } catch (err) {
            console.error("Failed to load preview:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl) {
            window.open(downloadUrl, '_blank');
        }
        setMoreMenuOpen(false);
    };

    const handleToggleStar = async () => {
        try {
            const id = previewFile.id || previewFile._id;
            await filesAPI.toggleStar(id);
            toast({ title: "Starred updated" });
        } catch (err) {
            toast({ title: "Failed to update star", variant: "destructive" });
        }
        setMoreMenuOpen(false);
    };

    const handleOpenInNewTab = () => {
        if (downloadUrl) {
            window.open(downloadUrl, '_blank');
        }
        setMoreMenuOpen(false);
    };

    if (!previewFile) return null;

    const fileType = previewFile.type || 'unknown';
    const isPDF = fileType === 'pdf' || previewFile.mimeType === 'application/pdf' || /\.pdf$/i.test(previewFile.name);
    const isImage = fileType === 'image' || previewFile.fileType?.startsWith('image/') || previewFile.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(previewFile.name);
    const isVideo = fileType === 'video' || previewFile.mimeType?.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(previewFile.name);

    // Determine icon color based on file type
    const getIconColor = () => {
        if (isPDF) return 'bg-red-500';
        if (isImage) return 'bg-rose-500';
        if (isVideo) return 'bg-purple-500';
        return 'bg-slate-500';
    };

    const menuItems = [
        { icon: Download, label: 'Download', onClick: handleDownload },
        { icon: FolderInput, label: 'Move', onClick: () => { setMoreMenuOpen(false); console.log('Move'); } },
        { icon: Star, label: 'Add to starred', onClick: handleToggleStar },
        { icon: Pencil, label: 'Rename', onClick: () => { setMoreMenuOpen(false); console.log('Rename'); } },
        { type: 'divider' },
        { icon: Search, label: 'Find', onClick: () => { setMoreMenuOpen(false); } },
        { icon: Info, label: 'Details', onClick: () => { setMoreMenuOpen(false); } },
        { icon: Shield, label: 'Security limitations', onClick: () => { setMoreMenuOpen(false); } },
        { type: 'divider' },
        { icon: BellOff, label: 'Disable PDF summary cards', onClick: () => { setMoreMenuOpen(false); } },
        { label: 'Manage comment notifications', onClick: () => { setMoreMenuOpen(false); }, noIcon: true },
        { type: 'divider' },
        { icon: ExternalLink, label: 'Open in new tab', onClick: handleOpenInNewTab },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100/50 backdrop-blur-sm text-white animate-in fade-in duration-200">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-slate-400/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={closePreview} className="text-brand-600 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className={`rounded p-1 ${getIconColor()}`}>
                            <FileText size={18} className="text-white" />
                        </div>
                        <h1 className="text-brand-600 font-medium truncate max-w-[300px]">{previewFile.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                     <Button variant="ghost" size="icon" className="text-brand-600 hover:bg-white/10 rounded-full" title="Download" onClick={handleDownload}>
                        <Download size={20} />
                    </Button>
                   
                </div>
            </header>

            {/* Main Content - Preview Not Available */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4" onClick={(e) => {
                if (e.target === e.currentTarget) closePreview();
            }}>
                {loading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                ) : (
                    <div className="bg-white text-slate-900 p-8 rounded w-full max-w-2xl text-center shadow-2xl">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${getIconColor()}`}>
                            <FileText size={40} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Preview not available</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Download the file to view it.
                        </p>
                        <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white" onClick={handleDownload}>
                            <Download size={18} className="mr-2" />
                            Download
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
