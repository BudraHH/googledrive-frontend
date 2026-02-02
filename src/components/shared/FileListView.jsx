import {
    Folder,
    MoreVertical,
    FileSpreadsheet,
    ImageIcon,
    FileText,
    ArrowDownAz,
    ArrowUp,
    ArrowDown,
    Share2,
    Download,
    Pencil,
    Star,
    FileCode,
    BookOpen
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MoreButtonMenu from "./MoreButtonMenu";
import { DATA_TYPES } from "@/constants/appConstants";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function FileListView({
    isLoading,
    items = [],
    viewMode = 'list',
    sortConfig = { key: 'name', direction: 'asc' },
    onSort = () => { },
    selectedItemIds = [],
    onItemClick = () => { },
    openMenuId,
    setOpenMenuId,
    menuRef,
    getIcon,
    columns = ['name', 'owner', 'modified', 'size'],
    onItemDoubleClick
}) {
    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={14} className="text-blue-600" />
            : <ArrowDown size={14} className="text-blue-600" />;
    };

    // Default icon getter if not provided - handles all file types
    const defaultGetIcon = (item) => {
        const type = item.type;
        const name = item.name?.toLowerCase() || '';

        // Check type first
        if (type === DATA_TYPES.FOLDER || type === 'folder') {
            // Updated to be filled styling to match Google Drive
            return <Folder size={20} className="text-slate-600 fill-slate-600" />;
        }
        if (type === DATA_TYPES.SHARED_FOLDER) {
            return <Folder size={20} className="text-blue-500 fill-blue-500/20" />;
        }
        if (type === DATA_TYPES.PDF) {
            return <FileText size={20} className="text-red-500" />;
        }
        if (type === DATA_TYPES.IMAGE) {
            return <ImageIcon size={20} className="text-rose-500" />;
        }
        if (type === DATA_TYPES.SPREADSHEET) {
            return <FileSpreadsheet size={20} className="text-green-600" />;
        }
        if (type === DATA_TYPES.DOCUMENT) {
            return <FileText size={20} className="text-blue-500" />;
        }
        if (type === DATA_TYPES.NOTEBOOK) {
            return <BookOpen size={20} className="text-orange-500" />;
        }
        if (type === DATA_TYPES.CODE) {
            return <FileCode size={20} className="text-green-500" />;
        }

        // Fallback: infer from extension
        if (name.endsWith('.pdf')) return <FileText size={20} className="text-red-500" />;
        if (name.endsWith('.txt') || name.endsWith('.md')) return <FileText size={20} className="text-slate-500" />;
        if (name.endsWith('.doc') || name.endsWith('.docx')) return <FileText size={20} className="text-blue-500" />;
        if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) return <FileSpreadsheet size={20} className="text-green-600" />;
        if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) return <ImageIcon size={20} className="text-rose-500" />;
        if (name.endsWith('.ipynb')) return <BookOpen size={20} className="text-orange-500" />;
        if (name.endsWith('.js') || name.endsWith('.py') || name.endsWith('.html') || name.endsWith('.css')) return <FileCode size={20} className="text-green-500" />;

        return <FileText size={20} className="text-slate-400" />;
    };

    const iconGetter = getIcon || defaultGetIcon;

    const isFolder = (item) => item.type === DATA_TYPES.FOLDER || item.type === 'folder' || item.type === DATA_TYPES.SHARED_FOLDER;

    const getColSpans = () => {
        if (viewMode === 'list') {
            if (columns.includes('details')) {
                return { name: 5, owner: 2, modified: 2, size: 1, location: 2, dateBinned: 2, details: 0, actions: 0 };
            }
            if (columns.includes('dateBinned')) {
                return { name: 5, owner: 2, modified: 0, size: 1, location: 2, dateBinned: 2, details: 0, actions: 0 };
            }
            return { name: 6, owner: 2, modified: 2, size: 2, location: 0, details: 0, actions: 0 };
        }
        return {};
    };

    const colSpans = getColSpans();

    const colStyle = (span) => ({ gridColumn: `span ${span} / span ${span}` });

    return (
        <>
            {viewMode === 'list' && (
                <div className="border border-slate-200 rounded flex flex-col min-h-0 overflow-hidden bg-white">
                    <div className="grid grid-cols-12 pl-4 pr-6 py-3 text-sm font-medium text-slate-500 border-b select-none ">
                        <div
                            style={colStyle(colSpans.name)}
                            className="flex items-center gap-2 cursor-pointer hover:text-slate-700 transition-colors pl-2"
                            onClick={() => onSort('name')}
                        >
                            Name
                            <SortIcon column="name" />
                        </div>

                        {columns.includes('owner') && colSpans.owner > 0 && (
                            <div
                                style={colStyle(colSpans.owner)}
                                className="cursor-pointer hover:text-slate-700 transition-colors"
                                onClick={() => onSort('owner')}
                            >
                                Owner
                            </div>
                        )}

                        {columns.includes('modified') && colSpans.modified > 0 && (
                            <div
                                style={colStyle(colSpans.modified)}
                                className="flex items-center gap-2 cursor-pointer hover:text-slate-700 transition-colors"
                                onClick={() => onSort('modified')}
                            >
                                Date modified
                                <SortIcon column="modified" />
                            </div>
                        )}

                        {columns.includes('dateBinned') && colSpans.dateBinned > 0 && (
                            <div
                                style={colStyle(colSpans.dateBinned)}
                                className="flex items-center gap-2 cursor-pointer hover:text-slate-700 transition-colors"
                                onClick={() => onSort('dateBinned')}
                            >
                                Date binned
                                <SortIcon column="dateBinned" />
                            </div>
                        )}

                        {columns.includes('size') && colSpans.size > 0 && (
                            <div
                                style={colStyle(colSpans.size)}
                                className="flex items-center gap-2 cursor-pointer hover:text-slate-700 transition-colors"
                                onClick={() => onSort('size')}
                            >
                                File size
                                <SortIcon column="size" />
                            </div>
                        )}

                        {columns.includes('location') && colSpans.location > 0 && (
                            <div style={colStyle(colSpans.location)} className="cursor-pointer hover:text-slate-700 transition-colors" onClick={() => onSort('location')}>
                                Original location
                                <SortIcon column="location" />
                            </div>
                        )}
                    </div>

                    <div className="w-full pr-1 pb-2 custom-scrollbar overflow-y-auto">
                        {isLoading ? (
                            <>
                                {[...Array(10)].map((_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        className="grid grid-cols-12 px-4 py-2.5 items-center border-b last:border-b-0"
                                    >
                                        <div style={colStyle(colSpans.name)} className="flex items-center gap-3 pl-2">
                                            <Skeleton className="h-5 w-5 rounded" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>

                                        {columns.includes('owner') && colSpans.owner > 0 && (
                                            <div style={colStyle(colSpans.owner)} className="flex items-center gap-2">
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                                <Skeleton className="h-4 w-8" />
                                            </div>
                                        )}

                                        {columns.includes('modified') && colSpans.modified > 0 && (
                                            <div style={colStyle(colSpans.modified)}>
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                        )}

                                        {columns.includes('dateBinned') && colSpans.dateBinned > 0 && (
                                            <div style={colStyle(colSpans.dateBinned)}>
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                        )}

                                        {columns.includes('size') && colSpans.size > 0 && (
                                            <div style={colStyle(colSpans.size)}>
                                                <Skeleton className="h-4 w-12" />
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </>
                        ) : (items.map((item) => {
                            const isSelected = selectedItemIds.includes(item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={(e) => onItemClick(item.id, e)}
                                    onDoubleClick={() => onItemDoubleClick && onItemDoubleClick(item)}
                                    className={`
                                        group relative grid grid-cols-12 px-4 py-2 items-center border-b last:border-b-0 
                                        transition-colors cursor-pointer
                                        ${isSelected
                                            ? 'bg-[#E8F0FE] border-transparent'
                                            : 'hover:bg-[#F1F3F4] border-slate-50'
                                        }
                                    `}
                                >
                                    <div style={colStyle(colSpans.name)} className="flex items-center gap-3 truncate pl-2">
                                        <div className="relative flex items-center justify-center w-6 h-6">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {iconGetter(item)}
                                            </div>
                                        </div>

                                        <span className={`text-[13px] font-medium truncate ${isSelected ? 'text-[#1967D2]' : 'text-[#3c4043]'}`}>
                                            {item.name}
                                        </span>
                                        {item.isStarred && <Star size={12} className="fill-yellow-400 text-yellow-400 flex-shrink-0 ml-1" />}
                                    </div>

                                    {columns.includes('owner') && colSpans.owner > 0 && (
                                        <div style={colStyle(colSpans.owner)} className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-slate-600 text-white">
                                                    ME
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-[13px] text-slate-500 font-medium">me</span>
                                        </div>
                                    )}

                                    {columns.includes('modified') && colSpans.modified > 0 && (
                                        <div style={colStyle(colSpans.modified)} className="relative h-full flex items-center">
                                            <span className="text-[13px] text-slate-500  transition-opacity duration-0">
                                                {item.modifiedDate}
                                            </span>
                                        </div>
                                    )}

                                    {columns.includes('dateBinned') && colSpans.dateBinned > 0 && (
                                        <div style={colStyle(colSpans.dateBinned)} className="relative h-full flex items-center">
                                            <span className="text-[13px] text-slate-500">
                                                {item.deletedDate ? new Date(item.deletedDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "--"}
                                            </span>
                                        </div>
                                    )}

                                    {columns.includes('size') && colSpans.size > 0 && (
                                        <div style={colStyle(colSpans.size)} className="text-[13px] text-slate-500">
                                            {item.size}
                                        </div>
                                    )}

                                    {columns.includes('location') && colSpans.location > 0 && (
                                        <div style={colStyle(colSpans.location)} className="flex items-center gap-2 text-slate-500 truncate">
                                            <Folder size={14} className="text-slate-400 flex-shrink-0" />
                                            <span className="text-xs truncate">{item.location || item.source || 'My Drive'}</span>
                                        </div>
                                    )}

                                    <div className="absolute right-2 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="p-1.5 rounded-full hover:bg-black/5 outline-none transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical size={18} className="text-slate-500" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <MoreButtonMenu item={item} />
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        }))}
                    </div>
                </div>
            )}

            {viewMode === "grid" && (
                <div className="h-full flex flex-col">
                    <div className="flex-1 w-full pr-1 pb-2 custom-scrollbar overflow-y-auto min-h-0">
                        {isLoading ? (
                            <>
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-3">
                                        {[...Array(4)].map((_, index) => (
                                            <div
                                                key={`skeleton-folder-${index}`}
                                                className="rounded-xl border border-slate-200 bg-white p-3 w-[220px] flex items-center gap-3"
                                            >
                                                <Skeleton className="h-6 w-6 rounded" />
                                                <div className="min-w-0 flex-1">
                                                    <Skeleton className="h-4 w-24 mb-1" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {[...Array(12)].map((_, index) => (
                                            <div
                                                key={`skeleton-file-${index}`}
                                                className="rounded-xl border border-slate-200 bg-slate-50"
                                            >
                                                <div className="p-3">
                                                    <Skeleton className="aspect-[4/3] rounded-lg w-full" />
                                                </div>
                                                <div className="px-3 pb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Skeleton className="h-5 w-5 rounded" />
                                                        <Skeleton className="h-4 flex-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {items.some(i => isFolder(i)) && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-3">
                                            {items
                                                .filter(i => isFolder(i))
                                                .map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={(e) => onItemClick(item.id, e)}
                                                        onDoubleClick={() => onItemDoubleClick && onItemDoubleClick(item)}
                                                        className={`group rounded-xl border border-slate-200 bg-white p-3 w-[220px] hover:bg-slate-100 transition-colors flex items-center gap-3 cursor-pointer ${selectedItemIds.includes(item.id) ? 'bg-blue-50 border-blue-200' : ''}`}
                                                    >
                                                        <Folder size={24} className="flex-shrink-0 text-slate-600 fill-slate-600" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[13px] font-medium text-slate-700 truncate">{item.name}</p>
                                                            {item.location && <p className="text-[11px] text-slate-400 truncate">{item.location}</p>}
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-700 transition-opacity" onClick={e => e.stopPropagation()}>
                                                                    <MoreVertical size={18} />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <MoreButtonMenu item={item} />
                                                        </DropdownMenu>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {items.some(i => !isFolder(i)) && (
                                    <div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                            {items
                                                .filter(i => !isFolder(i))
                                                .map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={(e) => onItemClick(item.id, e)}
                                                        onDoubleClick={() => onItemDoubleClick && onItemDoubleClick(item)}
                                                        className={`group rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer ${selectedItemIds.includes(item.id) ? 'bg-blue-50 border-blue-200' : ''
                                                            }`}
                                                    >
                                                        <div className="relative p-3">
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <button
                                                                            className="p-1 rounded-full hover:bg-slate-200/50 bg-white/50 backdrop-blur-sm outline-none transition-colors"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <MoreVertical
                                                                                size={16}
                                                                                className="text-slate-500 hover:text-slate-800"
                                                                            />
                                                                        </button>
                                                                    </DropdownMenuTrigger>
                                                                    <MoreButtonMenu item={item} />
                                                                </DropdownMenu>
                                                            </div>

                                                            <div className="aspect-[4/3] rounded-lg border border-slate-100 bg-white flex items-center justify-center">
                                                                {iconGetter(item)}
                                                            </div>
                                                        </div>

                                                        <div className="px-3 pb-3">
                                                            <div className="flex items-center gap-2">
                                                                {iconGetter(item)}
                                                                <p className="text-[13px] font-medium truncate text-slate-700">
                                                                    {item.name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
