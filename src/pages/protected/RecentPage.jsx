import { useState, useEffect, useMemo } from 'react';
import { Clock } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { DATA_TYPES } from "@/constants/appConstants";
import { groupItemsByTime } from "@/utils/timeUtils";
import { useDriveItems } from "@/hooks/useDriveItems.jsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MoreButtonMenu from "@/components/shared/MoreButtonMenu";
import { filesAPI } from '@/services/api/filesAPI';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function RecentPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                setLoading(true);
                const data = await filesAPI.getRecentItems();
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch recent items", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, []);


    // Filter out folders if strict "files only" logic is desired, but backend already filtered folders.
    // Ensure we passed valid array to hook
    const recentFiles = useMemo(() => items, [items]);

    const {
        sortedItems,
        sortConfig,
        filterConfig,
        viewMode,
        openMenuId,
        selectedItemIds,
        menuRef,
        setViewMode,
        setOpenMenuId,
        setSelectedItemIds,
        handleSort,
        handleFilterChange,
        handleItemClick,
        getIcon,
        defaultFilters,
    } = useDriveItems(recentFiles);

    // Recent-specific filters (no "Source" filter since recent items can be from anywhere)
    const recentFilters = [
        { label: "Type", key: "type", options: ["Folders", "PDFs", "Images", "Spreadsheets", "Documents"] },
        { label: "People", key: "people", options: ["Me", "Anyone"] },
        { label: "Modified", key: "modified", options: ["Today", "Last 7 days", "Last 30 days", "This year"] },
        // { label: "Source", key: "source", options: ["My Drive", "Shared with me", "Computers"] },
    ];

    const handleDownloadSelected = async () => {
        if (!selectedItemIds.length) return;

        for (const id of selectedItemIds) {
            const item = items.find(i => (i.id || i._id) === id);
            if (!item) continue;

            if (item.type === DATA_TYPES.FOLDER || item.type === DATA_TYPES.SHARED_FOLDER || item.type === 'folder') {
                toast({
                    title: "Cannot download folder",
                    description: `Folder "${item.name}" cannot be downloaded directly.`,
                    variant: "destructive"
                });
                continue;
            }

            try {
                const { downloadURL, fileName } = await filesAPI.getDownloadUrl(item.id || item._id);
                const link = document.createElement('a');
                link.href = downloadURL;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Download error:', error);
                toast({
                    title: "Download failed",
                    description: `Failed to download "${item.name}"`,
                    variant: "destructive"
                });
            }
        }
        setSelectedItemIds([]);
    };

    const handleItemDoubleClick = (item) => {
        if (item.type === DATA_TYPES.FOLDER || item.type === 'folder') {
            // Recent usually doesn't show folders directly mixed, but if it does:
            // navigate(ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', item.id));
        } else {
            usePreviewStore.getState().setPreviewFile(item);
        }
    };

    // Group items by time period
    const groupedItems = groupItemsByTime(sortedItems);

    // Check if recent is truly empty vs filter showing no results
    const isRecentEmpty = !loading && items.length === 0;
    const hasNoFilterResults = !loading && items.length > 0 && sortedItems.length === 0;

    // Show empty state without header only if no recent items exist
    if (isRecentEmpty) {
        return (
            <div className="h-full bg-white text-slate-900 p-6">
                <EmptyState
                    icon={Clock}
                    title="No recent files"
                    description="Files you've recently opened or edited will appear here"
                    iconClassName="text-slate-400"
                />
            </div>
        );
    }

    // Skeleton loading component for list view
    const SkeletonRow = () => (
        <div className="grid grid-cols-12 px-4 py-3 items-center border-b last:border-b-0">
            <div className="col-span-4 flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="col-span-1">
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-8" />
            </div>
            <div className="col-span-1">
                <Skeleton className="h-4 w-12" />
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-1 flex justify-end">
                <Skeleton className="h-5 w-5 rounded" />
            </div>
        </div>
    );

    return (
        <div className="h-full bg-white text-slate-900 p-6 flex flex-col">
            {/* Header */}
            <PageHeader
                selectedItemIds={selectedItemIds}
                onClearSelection={() => setSelectedItemIds([])}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                filters={recentFilters}
                showFilters={true}
                showViewToggle={true}
                onDownload={handleDownloadSelected}
            />

            {/* Show message when filters return no results */}
            {hasNoFilterResults ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                        <p className="text-sm">No files match your current filters</p>
                        <p className="text-xs mt-1">Try adjusting or clearing your filters</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 w-full pr-1 custom-scrollbar overflow-y-auto min-h-0">

                    {/* List View with Groups */}
                    {viewMode === 'list' && (
                        <div className="space-y-6">
                            {/* Skeleton Loading State */}
                            {loading && (
                                <div>
                                    {/* Skeleton Group Header */}
                                    <Skeleton className="h-4 w-16 mb-3" />

                                    {/* Skeleton Table */}
                                    <div className="border border-slate-200 rounded">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-12 px-4 py-3 text-sm text-slate-500 bg-slate-50 border-b select-none">
                                            <div className="col-span-4">Name</div>
                                            <div className="col-span-1"></div>
                                            <div className="col-span-2">Owner</div>
                                            <div className="col-span-1">File size</div>
                                            <div className="col-span-3">Location</div>
                                            <div className="col-span-1 text-right"></div>
                                        </div>

                                        {/* Skeleton Rows */}

                                    </div>
                                </div>
                            )}

                            {/* Actual Content */}
                            {!loading && groupedItems.map(({ name: groupName, items: groupItems }) => (
                                <div key={groupName}>
                                    {/* Group Header */}
                                    <h3 className="text-sm font-medium text-slate-700 mb-3">{groupName}</h3>

                                    {/* Table */}
                                    <div className="border border-slate-200 rounded">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-12 px-4 py-3 text-sm text-slate-500 bg-slate-50 border-b select-none">
                                            <div className="col-span-4">Name</div>
                                            <div className="col-span-1"></div>
                                            <div className="col-span-2">Owner</div>
                                            <div className="col-span-1">File size</div>
                                            <div className="col-span-3">Location</div>
                                            <div className="col-span-1 text-right"></div>
                                        </div>

                                        {/* Rows */}
                                        {loading ? ([...Array(5)].map((_, index) => (
                                            <SkeletonRow key={`skeleton-${index}`} />
                                        ))) : (groupItems.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={(e) => handleItemClick(item.id, e)}
                                                onDoubleClick={() => handleItemDoubleClick(item)}
                                                className={`grid grid-cols-12 px-4 py-3 items-center border-b last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer ${selectedItemIds.includes(item.id) ? 'bg-blue-50 border-blue-200' : ''
                                                    }`}
                                            >
                                                <div className="col-span-4 flex items-center gap-3 truncate">
                                                    {getIcon(item)}
                                                    <span className="text-sm truncate text-slate-700">{item.name}</span>
                                                </div>

                                                <div className="col-span-1 text-sm text-slate-500 truncate">
                                                    {item.modifiedDate}
                                                </div>

                                                <div className="col-span-2 flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-[10px] bg-slate-800 text-white">
                                                            ME
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-slate-600 font-medium">me</span>
                                                </div>

                                                <div className="col-span-1 text-sm text-slate-500">
                                                    {item.size}
                                                </div>

                                                <div className="col-span-3 flex items-center justify-start gap-2 text-sm text-slate-500 truncate relative">
                                                    <div className="flex items-center gap-2 truncate max-w-[120px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-400 flex-shrink-0">
                                                            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                                                        </svg>
                                                        <span className="truncate">{item.location || item.source}</span>
                                                    </div>


                                                </div>
                                                <div className="col-span-1 text-right">

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(openMenuId === item.id ? null : item.id);
                                                        }}
                                                        className="ml-2 flex-shrink-0"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 16 16" className="text-slate-400 hover:text-slate-700">
                                                            <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                                                            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                                            <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                                                        </svg>
                                                    </button>
                                                    {openMenuId === item.id && (
                                                        <MoreButtonMenu
                                                            item={item}
                                                            menuRef={menuRef}
                                                            setOpenMenuId={setOpenMenuId}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )))}

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Grid View */}
                    {viewMode === "grid" && (
                        <div className="space-y-6">
                            {/* Skeleton Loading State */}
                            {loading && (
                                <div>
                                    {/* Skeleton Group Header */}
                                    <Skeleton className="h-4 w-16 mb-3" />

                                    {/* Skeleton Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {[...Array(6)].map((_, index) => (
                                            <div
                                                key={`skeleton-grid-${index}`}
                                                className="rounded-xl border border-slate-200 bg-slate-50"
                                            >
                                                <div className="p-3">
                                                    <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                                                </div>
                                                <div className="px-3 pb-3">
                                                    <Skeleton className="h-4 w-full mb-2" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actual Content */}
                            {!loading && groupedItems.map(({ name: groupName, items: groupItems }) => (
                                <div key={groupName}>
                                    {/* Group Header */}
                                    <h3 className="text-sm font-medium text-slate-700 mb-3">{groupName}</h3>

                                    {/* Files */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {groupItems.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={(e) => handleItemClick(item.id, e)}
                                                onDoubleClick={() => handleItemDoubleClick(item)}
                                                className={`group rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer ${selectedItemIds.includes(item.id) ? 'bg-blue-50 border-blue-200' : ''
                                                    }`}
                                            >
                                                {/* Preview */}
                                                <div className="relative p-3">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenMenuId(openMenuId === item.id ? null : item.id);
                                                            }}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 16 16" className="text-slate-400 hover:text-slate-700">
                                                                <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                                                                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                                                <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                                                            </svg>
                                                        </button>
                                                        {openMenuId === item.id && (
                                                            <MoreButtonMenu
                                                                item={item}
                                                                menuRef={menuRef}
                                                                setOpenMenuId={setOpenMenuId}
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="aspect-[4/3] rounded-lg border border-slate-100 bg-slate-100 flex items-center justify-center">
                                                        {getIcon(item)}
                                                    </div>
                                                </div>

                                                {/* Name */}
                                                <div className="px-3 pb-3">
                                                    <p className="text-sm font-medium truncate text-slate-900">
                                                        {item.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
