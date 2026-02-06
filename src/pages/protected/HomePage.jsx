import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import {
    Plus,
    Folder,
    Share2,
    Clock,
    Star,
    Trash2,
    HardDrive,
    LayoutGrid,
    List,
    MoreVertical,
    Search,
    Download,
    ChevronDown,
    FileText,
    Image as ImageIcon,
    FileCode,
    FileArchive,
    UploadCloud,
    X,
    FolderPlus,
    Eye,
    Link as LinkIcon,
    History,
    MoreHorizontal,
    ChevronRight,
    SearchIcon,
    ArrowUpRight,
    FileSpreadsheet,
    BookOpen
} from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { filesAPI } from '@/services/api/filesAPI';
import { useFileUpload } from '@/hooks/useFileUpload';
import FileListView from '@/components/shared/FileListView';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { DATA_TYPES } from '@/constants/appConstants';
import { Skeleton } from "@/components/ui/skeleton";
import { usePreviewStore } from "@/stores/usePreviewStore";

// Suggested content limits (like Google Drive)
const FOLDER_COLLAPSED_LIMIT = 6;
const FOLDER_EXPANDED_LIMIT = 12;
const FILE_COLLAPSED_LIMIT = 10;
const FILE_EXPANDED_LIMIT = 30;

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [viewMode, setViewMode] = useState('list');
    const [isCreateFolderOpen, setCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    // Folder/File expand states
    const [foldersExpanded, setFoldersExpanded] = useState(false);
    const [filesExpanded, setFilesExpanded] = useState(false);

    // Section collapse states
    const [suggestedFilesOpen, setSuggestedFilesOpen] = useState(true);
    const [suggestedFoldersOpen, setSuggestedFoldersOpen] = useState(true);

    // Data states
    const [allItems, setAllItems] = useState([]);
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use the upload hook for drag & drop logic
    const { dragProps, isDragging, handleUpload } = useFileUpload(null);

    // Fetch all items and recent items
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [items, recent] = await Promise.all([
                filesAPI.getItems(null), // Root folder items
                filesAPI.getRecentItems() // Recently accessed items
            ]);
            setAllItems(items);
            setRecentItems(recent);
        } catch (error) {
            console.error("Failed to fetch files:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const handleRefresh = () => fetchData();
        window.addEventListener('refresh-files', handleRefresh);
        return () => window.removeEventListener('refresh-files', handleRefresh);
    }, [fetchData]);

    // Combine and sort to get suggested folders
    // Priority: recently accessed > frequently shared > recently modified
    const getSuggestedFolders = useCallback(() => {
        const folderTypes = [DATA_TYPES.FOLDER, DATA_TYPES.SHARED_FOLDER, DATA_TYPES.IMPORTED_FOLDER, DATA_TYPES.SYNCED_FOLDER, 'folder'];

        // Get folders from all items
        const allFolders = allItems.filter(f => folderTypes.includes(f.type));

        // Get folders from recent items (these have higher priority)
        const recentFolders = recentItems.filter(f => folderTypes.includes(f.type));

        // Create a map to track folders and their priority score
        const folderMap = new Map();

        // Add recent folders with high priority
        recentFolders.forEach((folder, index) => {
            folderMap.set(folder.id || folder._id, {
                ...folder,
                priority: 100 - index // Higher position = higher priority
            });
        });

        // Add remaining folders with lower priority
        allFolders.forEach((folder, index) => {
            const id = folder.id || folder._id;
            if (!folderMap.has(id)) {
                folderMap.set(id, {
                    ...folder,
                    priority: 50 - index
                });
            }
        });

        // Sort by priority and return
        return Array.from(folderMap.values())
            .sort((a, b) => b.priority - a.priority);
    }, [allItems, recentItems]);

    // Combine and sort to get suggested files
    // Priority: recently opened/edited > shared > recently modified
    const getSuggestedFiles = useCallback(() => {
        const folderTypes = [DATA_TYPES.FOLDER, DATA_TYPES.SHARED_FOLDER, DATA_TYPES.IMPORTED_FOLDER, DATA_TYPES.SYNCED_FOLDER, 'folder'];

        // Get files (non-folders) from recent items first
        const recentFiles = recentItems.filter(f => !folderTypes.includes(f.type));

        // Get files from all items
        const allFiles = allItems.filter(f => !folderTypes.includes(f.type));

        // Create a map to track files and their priority
        const fileMap = new Map();

        // Add recent files with high priority
        recentFiles.forEach((file, index) => {
            fileMap.set(file.id || file._id, {
                ...file,
                priority: 100 - index
            });
        });

        // Add remaining files with lower priority
        allFiles.forEach((file, index) => {
            const id = file.id || file._id;
            if (!fileMap.has(id)) {
                fileMap.set(id, {
                    ...file,
                    priority: 50 - index
                });
            }
        });

        // Sort by priority and return
        return Array.from(fileMap.values())
            .sort((a, b) => b.priority - a.priority);
    }, [allItems, recentItems]);

    const suggestedFolders = getSuggestedFolders();
    const suggestedFiles = getSuggestedFiles();

    // Get display items based on expanded state
    const displayedFolders = foldersExpanded
        ? suggestedFolders.slice(0, FOLDER_EXPANDED_LIMIT)
        : suggestedFolders.slice(0, FOLDER_COLLAPSED_LIMIT);

    const displayedFiles = filesExpanded
        ? suggestedFiles.slice(0, FILE_EXPANDED_LIMIT)
        : suggestedFiles.slice(0, FILE_COLLAPSED_LIMIT);

    // Check if "View more" should be shown
    const hasMoreFolders = suggestedFolders.length > FOLDER_COLLAPSED_LIMIT;
    const hasMoreFiles = suggestedFiles.length > FILE_COLLAPSED_LIMIT;

    const onDrop = useCallback((acceptedFiles) => {
        console.log("Dropped files in dashboard area", acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            await filesAPI.createFolder(newFolderName);
            toast.success(`Folder "${newFolderName}" created`);
            setNewFolderName('');
            setCreateFolderOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to create folder");
        }
    };

    // Get icon based on item type and extension
    const getTypeIcon = (item) => {
        const type = item.type;
        const name = item.name?.toLowerCase() || '';

        // Check type first
        if (type === DATA_TYPES.FOLDER || type === 'folder') {
            return <Folder size={18} className="text-slate-600" />;
        }
        if (type === DATA_TYPES.SHARED_FOLDER) {
            return <Folder size={18} className="text-blue-500" />;
        }
        if (type === DATA_TYPES.PDF) {
            return <FileText size={16} className="text-red-500" />;
        }
        if (type === DATA_TYPES.IMAGE) {
            return <ImageIcon size={16} className="text-rose-500" />;
        }
        if (type === DATA_TYPES.SPREADSHEET) {
            return <FileSpreadsheet size={16} className="text-green-600" />;
        }
        if (type === DATA_TYPES.DOCUMENT) {
            return <FileText size={16} className="text-blue-500" />;
        }
        if (type === DATA_TYPES.NOTEBOOK) {
            return <BookOpen size={16} className="text-orange-500" />;
        }
        if (type === DATA_TYPES.CODE) {
            return <FileCode size={16} className="text-green-500" />;
        }

        // Fallback: infer from extension
        if (name.endsWith('.pdf')) return <FileText size={16} className="text-red-500" />;
        if (name.endsWith('.txt') || name.endsWith('.md')) return <FileText size={16} className="text-slate-500" />;
        if (name.endsWith('.doc') || name.endsWith('.docx')) return <FileText size={16} className="text-blue-500" />;
        if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) return <FileSpreadsheet size={16} className="text-green-600" />;
        if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) return <ImageIcon size={16} className="text-rose-500" />;
        if (name.endsWith('.ipynb')) return <BookOpen size={16} className="text-orange-500" />;
        if (name.endsWith('.js') || name.endsWith('.py') || name.endsWith('.html') || name.endsWith('.css')) return <FileCode size={16} className="text-green-500" />;

        return <FileText size={16} className="text-slate-400" />;
    };

    const getOwnerAvatar = (owner) => {
        if (owner === 'me') {
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-slate-900 text-white text-[10px] font-bold">ME</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-slate-600 tracking-tight">me</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border border-white shadow-sm ring-1 ring-slate-100">
                    <AvatarFallback className="bg-brand-100 text-brand-700 text-[10px] font-bold">{owner?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold text-slate-600 truncate max-w-[80px] tracking-tight">{owner}</span>
            </div>
        );
    };

    // Skeleton folder card
    const SkeletonFolderCard = () => (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 w-[220px] flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );

    return (
        <div {...getRootProps()} className="flex flex-col h-full overflow-hidden bg-white relative">
            <input {...getInputProps()} />

            {/* Drag & Drop Overlay */}
            <AnimatePresence>
                {isDragActive && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-brand-500/10 backdrop-blur-sm border-4 border-dashed border-brand-500 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="bg-white p-8 rounded-full shadow-2xl mb-4 border border-brand-100">
                            <UploadCloud size={64} className="text-brand-600 animate-bounce" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">DROP TO UPLOAD</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Files will be stored in your CloudDrive</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Toolbar */}
            <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
                <h1 className="text-xl font-black text-brand-600 tracking-tight flex items-center">
                    Welcome to CloudDrive<span className="text-2xl text-brand-900 font-bold">.</span>
                </h1>
            </header>

            {/* Explorer Area */}
            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar relative space-y-10">

                {/* Suggested Folders Section */}
                <section>
                    <button
                        onClick={() => setSuggestedFoldersOpen(!suggestedFoldersOpen)}
                        className="flex items-center gap-2 w-full mb-4 group outline-none"
                    >
                        <div
                            className={`text-slate-500 ${suggestedFoldersOpen ? 'rotate-0' : '-rotate-90'}`}
                        >
                            <ChevronDown size={16} />
                        </div>
                        <h3 className="text-sm font-medium text-slate-700">Suggested Folders</h3>
                        {!loading && suggestedFolders.length > 0 && (
                            <span className="text-xs text-slate-400 ml-1">
                                ({foldersExpanded ? Math.min(suggestedFolders.length, FOLDER_EXPANDED_LIMIT) : Math.min(suggestedFolders.length, FOLDER_COLLAPSED_LIMIT)} of {suggestedFolders.length})
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {suggestedFoldersOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Folder Grid */}
                                <div className="flex flex-wrap gap-3 mb-3">
                                    {loading ? (
                                        // Skeleton loading
                                        [...Array(6)].map((_, i) => <SkeletonFolderCard key={i} />)
                                    ) : displayedFolders.length === 0 ? (
                                        <div className="w-full py-8 text-center text-slate-400 text-sm">
                                            No folders found. Create your first folder to get started!
                                        </div>
                                    ) : (
                                        displayedFolders.map((folder) => (
                                            <div
                                                key={folder.id || folder._id}
                                                className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 w-[220px] hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center gap-3"
                                                onClick={() => navigate(ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', folder.id || folder._id))}
                                            >
                                                <Folder className="flex-shrink-0 text-slate-500 fill-slate-500/10" size={20} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-700 truncate">
                                                        {folder.name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 truncate">
                                                        {folder.location || folder.source || 'My Drive'}
                                                    </p>
                                                </div>
                                                <button
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* View More / View Less Button */}
                                {hasMoreFolders && !loading && (
                                    <button
                                        onClick={() => setFoldersExpanded(!foldersExpanded)}
                                        className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
                                    >
                                        {foldersExpanded ? (
                                            <>View less</>
                                        ) : (
                                            <>View more ({Math.min(suggestedFolders.length, FOLDER_EXPANDED_LIMIT) - FOLDER_COLLAPSED_LIMIT} more)</>
                                        )}
                                        <ChevronRight size={14} className={`transition-transform ${foldersExpanded ? '-rotate-90' : 'rotate-90'}`} />
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Suggested Files Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setSuggestedFilesOpen(!suggestedFilesOpen)}
                            className="flex items-center gap-2 group outline-none"
                        >
                            <div
                                className={`text-slate-500 ${suggestedFilesOpen ? 'rotate-0' : '-rotate-90'}`}
                            >
                                <ChevronDown size={16} />
                            </div>
                            <h3 className="text-sm font-medium text-slate-700">Suggested Files</h3>
                            {!loading && suggestedFiles.length > 0 && (
                                <span className="text-xs text-slate-400 ml-1">
                                    ({filesExpanded ? Math.min(suggestedFiles.length, FILE_EXPANDED_LIMIT) : Math.min(suggestedFiles.length, FILE_COLLAPSED_LIMIT)} of {suggestedFiles.length})
                                </span>
                            )}
                        </button>

                        {/* View Toggle */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <List size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {suggestedFilesOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="overflow-hidden">
                                    {loading ? (
                                        <FileListView
                                            isLoading={true}
                                            items={[]}
                                            viewMode={viewMode}
                                            columns={['name', 'details', 'owner', 'location']}
                                            getIcon={getTypeIcon}
                                            selectedItemIds={[]}
                                            onItemClick={() => { }}
                                        />
                                    ) : displayedFiles.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400 text-sm">
                                            No files found. Drag and drop to upload your first file!
                                        </div>
                                    ) : (
                                        <FileListView
                                            isLoading={false}
                                            items={displayedFiles.map(f => ({
                                                ...f,
                                                id: f.id || f._id,
                                                details: f.activity ? `${f.activity} • ${f.time || f.modifiedDate}` : f.modifiedDate,
                                                modifiedDate: f.modifiedDate || f.time
                                            }))}
                                            viewMode={viewMode}
                                            columns={['name', 'details', 'owner', 'location']}
                                            getIcon={getTypeIcon}
                                            selectedItemIds={[]}
                                            onItemClick={(item) => {
                                                const folderTypes = [DATA_TYPES.FOLDER, DATA_TYPES.SHARED_FOLDER, DATA_TYPES.IMPORTED_FOLDER, DATA_TYPES.SYNCED_FOLDER, 'folder'];
                                                if (folderTypes.includes(item.type)) {
                                                    navigate(ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', item.id));
                                                } else {
                                                    usePreviewStore.getState().setPreviewFile(item);
                                                }
                                            }}
                                            onItemDoubleClick={(item) => {
                                                if (item.type === 'folder' || item.type === DATA_TYPES.FOLDER) {
                                                    navigate(ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', item.id));
                                                } else {
                                                    usePreviewStore.getState().setPreviewFile(item);
                                                }
                                            }}
                                        />
                                    )}

                                    {/* View More / View Less Button */}
                                    {hasMoreFiles && !loading && (
                                        <button
                                            onClick={() => setFilesExpanded(!filesExpanded)}
                                            className="mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
                                        >
                                            {filesExpanded ? (
                                                <>View less</>
                                            ) : (
                                                <>View more ({Math.min(suggestedFiles.length, FILE_EXPANDED_LIMIT) - FILE_COLLAPSED_LIMIT} more files)</>
                                            )}
                                            <ChevronRight size={14} className={`transition-transform ${filesExpanded ? '-rotate-90' : 'rotate-90'}`} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            {/* Create Folder Dialog */}
            <Dialog open={isCreateFolderOpen} onOpenChange={setCreateFolderOpen}>
                <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] p-12 ring-1 ring-slate-100 overflow-hidden relative">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black text-slate-900 flex items-center gap-5">
                            <div className="p-5 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                                <FolderPlus size={36} />
                            </div>
                            New Folder
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.15em] text-[10px] pl-1 pt-2">
                            Structuralize your cloud workspace
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-12">
                        <div className="relative group">
                            <Folder className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                            <Input
                                placeholder="Untitled Folder"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                autoFocus
                                className="h-20 border-slate-100 bg-slate-50/50 rounded-[2rem] focus-visible:ring-brand-500 font-black text-2xl pr-10 pl-16 transition-all placeholder:text-slate-200"
                            />
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-end gap-4">
                        <Button variant="ghost" onClick={() => setCreateFolderOpen(false)} className="rounded-2xl font-black px-10 h-14 text-slate-400 hover:bg-slate-50 transition-all tracking-widest text-xs">
                            CANCEL
                        </Button>
                        <Button
                            onClick={handleCreateFolder}
                            disabled={!newFolderName.trim()}
                            className="bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black px-14 h-14 shadow-2xl shadow-slate-300 transition-all active:scale-95 text-xs tracking-widest"
                        >
                            CREATE
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
            `}</style>
        </div>
    );
}
