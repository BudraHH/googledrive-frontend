import { useState } from "react";
import {
    Download,
    Pencil,
    Sparkles,
    Share2,
    FolderTree,
    ChevronRight,
    Trash2,
    Info,
    FolderPlus,
    Star,
    RotateCcw
} from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DATA_TYPES, MUTATION_TYPES } from "@/constants/appConstants";
import { filesAPI } from "@/services/api/filesAPI";
import { useToast } from "@/hooks/use-toast";

export default function MoreButtonMenu({
    item,
    onNewFolder,
    onItemUpdated,
    onClose
}) {
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [newName, setNewName] = useState(item?.name || "");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const isFolder = item && [
        DATA_TYPES.FOLDER,
        DATA_TYPES.SHARED_FOLDER,
        DATA_TYPES.IMPORTED_FOLDER,
        DATA_TYPES.SYNCED_FOLDER
    ].includes(item.type);

    const isTrashed = item?.mutation_type === MUTATION_TYPES.TRASHED;
    const isStarred = item?.mutation_type === MUTATION_TYPES.STARRED;

    // Close menu helper
    const closeMenuAndRefresh = () => {
        if (onClose) onClose();
        window.dispatchEvent(new Event('refresh-files'));
        if (onItemUpdated) onItemUpdated();
    };

    // Download handler
    const handleDownload = async () => {
        if (!item || isFolder) {
            toast({
                title: "Cannot download",
                description: isFolder ? "Folder download is not supported yet" : "No item selected",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsLoading(true);
            const { downloadURL, fileName } = await filesAPI.getDownloadUrl(item._id);

            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Download started",
                description: `Downloading ${fileName}...`
            });
        } catch (error) {
            console.error('Download error:', error);
            toast({
                title: "Download failed",
                description: error.response?.data?.message || "Could not download file",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            if (onClose) onClose();
        }
    };

    // Rename handler
    const handleRename = async () => {
        if (!newName.trim() || newName.trim() === item.name) {
            setIsRenameDialogOpen(false);
            return;
        }

        try {
            setIsLoading(true);
            await filesAPI.rename(item._id, newName.trim());

            toast({
                title: "Renamed successfully",
                description: `Renamed to "${newName.trim()}"`
            });

            setIsRenameDialogOpen(false);
            closeMenuAndRefresh();
        } catch (error) {
            console.error('Rename error:', error);
            toast({
                title: "Rename failed",
                description: error.response?.data?.message || "Could not rename item",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Trash handler
    const handleTrash = async () => {
        try {
            setIsLoading(true);
            await filesAPI.trash(item._id);

            toast({
                title: "Moved to bin",
                description: `"${item.name}" has been moved to the bin`
            });

            closeMenuAndRefresh();
        } catch (error) {
            console.error('Trash error:', error);
            toast({
                title: "Failed to move to bin",
                description: error.response?.data?.message || "Could not move item to bin",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Restore handler
    const handleRestore = async () => {
        try {
            setIsLoading(true);
            await filesAPI.restore(item._id);

            toast({
                title: "Restored",
                description: `"${item.name}" has been restored`
            });

            closeMenuAndRefresh();
        } catch (error) {
            console.error('Restore error:', error);
            toast({
                title: "Restore failed",
                description: error.response?.data?.message || "Could not restore item",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle star handler
    const handleToggleStar = async () => {
        try {
            setIsLoading(true);
            const result = await filesAPI.toggleStar(item._id);

            toast({
                title: result.isStarred ? "Starred" : "Unstarred",
                description: result.isStarred
                    ? `"${item.name}" added to starred items`
                    : `"${item.name}" removed from starred items`
            });

            closeMenuAndRefresh();
        } catch (error) {
            console.error('Star toggle error:', error);
            toast({
                title: "Action failed",
                description: error.response?.data?.message || "Could not update star status",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Permanent delete handler
    const handleDeleteForever = async () => {
        if (!confirm(`Are you sure you want to permanently delete "${item.name}"? This cannot be undone.`)) {
            return;
        }

        try {
            setIsLoading(true);
            await filesAPI.deleteForever(item._id);

            toast({
                title: "Permanently deleted",
                description: `"${item.name}" has been permanently deleted`
            });

            closeMenuAndRefresh();
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                title: "Delete failed",
                description: error.response?.data?.message || "Could not delete item",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <>
            <DropdownMenuContent align="end" className="w-64 rounded border-slate-200 shadow-lg">
                {/* ---------- TRASHED CONTEXT MENU ---------- */}
                {isTrashed && item && (
                    <>
                        {/* Open file with - files only */}
                        {!isFolder && (
                            <DropdownMenuItem
                                className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Open with', item.name);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                        <Sparkles className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="truncate">Open file with</span>
                                </div>
                            </DropdownMenuItem>
                        )}

                        {/* Download - files only */}
                        {!isFolder && (
                            <DropdownMenuItem
                                className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload();
                                }}
                                disabled={isLoading}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                        <Download className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="truncate">Download</span>
                                </div>
                            </DropdownMenuItem>
                        )}

                        {/* File/Folder information */}
                        <DropdownMenuItem
                            className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsInfoDialogOpen(true);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                    <Info className="h-3.5 w-3.5" />
                                </div>
                                <span className="truncate">{isFolder ? 'Folder' : 'File'} information</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-100 my-1" />

                        {/* Restore */}
                        <DropdownMenuItem
                            className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRestore();
                            }}
                            disabled={isLoading}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100 text-green-600">
                                    <RotateCcw className="h-3.5 w-3.5" />
                                </div>
                                <span className="truncate">Restore</span>
                            </div>
                        </DropdownMenuItem>

                        {/* Delete forever */}
                        <DropdownMenuItem
                            className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none group"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteForever();
                            }}
                            disabled={isLoading}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500 group-focus:text-red-500 transition-colors">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </div>
                                <span className="truncate group-focus:text-red-600">Delete forever</span>
                            </div>
                            <span className="text-xs text-slate-400">Delete</span>
                        </DropdownMenuItem>
                    </>
                )}

                {/* ---------- NORMAL CONTEXT MENU (Not Trashed) ---------- */}
                {!isTrashed && (
                    <>
                        {onNewFolder && (
                            <>
                                <DropdownMenuItem
                                    className="flex items-center justify-between px-2 py-2.5 focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onNewFolder();
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                            <FolderPlus className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="truncate">New folder</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            </>
                        )}

                        {item && !isFolder && (
                            <DropdownMenuItem
                                className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Open with', item.name);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                        <Sparkles className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="truncate">Open file with</span>
                                </div>
                            </DropdownMenuItem>
                        )}

                        {item && (
                            <>
                                {/* Download - only for files */}
                                {!isFolder && (
                                    <DropdownMenuItem
                                        className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload();
                                        }}
                                        disabled={isLoading}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                                <Download className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="truncate">Download</span>
                                        </div>
                                    </DropdownMenuItem>
                                )}

                                {/* Rename */}
                                <DropdownMenuItem
                                    className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setNewName(item.name);
                                        setIsRenameDialogOpen(true);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="truncate">Rename</span>
                                    </div>
                                    <span className="text-xs text-slate-400">Ctrl+Alt+E</span>
                                </DropdownMenuItem>

                                {/* Star toggle */}
                                <DropdownMenuItem
                                    className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleStar();
                                    }}
                                    disabled={isLoading}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-6 w-6 items-center justify-center rounded ${isStarred ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Star className="h-3.5 w-3.5" fill={isStarred ? "currentColor" : "none"} />
                                        </div>
                                        <span className="truncate">{isStarred ? 'Remove star' : 'Add star'}</span>
                                    </div>
                                </DropdownMenuItem>

                                {/* Share */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger
                                        className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                                <Share2 className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="truncate">Share</span>
                                        </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-48 p-1">
                                        <DropdownMenuItem onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast({
                                                title: "Link copied",
                                                description: "The link has been copied to your clipboard."
                                            });
                                            if (onClose) onClose();
                                        }}>
                                            <span className="truncate">Copy link</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {/* File/Folder information */}
                                <DropdownMenuItem
                                    className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsInfoDialogOpen(true);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                                            <Info className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="truncate">{isFolder ? 'Folder' : 'File'} information</span>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-slate-100" />

                                {/* Move to bin */}
                                <DropdownMenuItem
                                    className="flex items-center justify-between focus:bg-slate-50 focus:text-slate-700 cursor-pointer text-slate-600 outline-none group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTrash();
                                    }}
                                    disabled={isLoading}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500 group-focus:text-red-500 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="truncate group-focus:text-red-600">Move to bin</span>
                                    </div>
                                    <span className="text-xs text-slate-400">Delete</span>
                                </DropdownMenuItem>
                            </>
                        )}
                    </>
                )}
            </DropdownMenuContent>

            {/* Rename Dialog */}
            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rename</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new name"
                            className="w-full"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleRename();
                                }
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRenameDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRename}
                            disabled={isLoading || !newName.trim()}
                        >
                            {isLoading ? 'Renaming...' : 'Rename'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Info Dialog */}
            <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isFolder ? 'Folder' : 'File'} Information</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Name:</span>
                            <span className="font-medium">{item?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Type:</span>
                            <span className="font-medium">{item?.type}</span>
                        </div>
                        {!isFolder && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">Size:</span>
                                <span className="font-medium">{item?.size || '--'}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-slate-500">Owner:</span>
                            <span className="font-medium">{item?.owner}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Modified:</span>
                            <span className="font-medium">{item?.modifiedDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Location:</span>
                            <span className="font-medium">{item?.source || 'My Drive'}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsInfoDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}