import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import FileListView from "@/components/shared/FileListView";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { DATA_TYPES } from "@/constants/appConstants";
import { useDriveItems } from "@/hooks/useDriveItems.jsx";
import { filesAPI } from "@/services/api/filesAPI";
import { useToast } from "@/hooks/use-toast";
import { usePreviewStore } from "@/stores/usePreviewStore";

export default function StarredPage() {
    const { toast } = useToast();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStarredItems = async () => {
        try {
            setIsLoading(true);
            const data = await filesAPI.getStarredItems();
            setItems(data);
        } catch (error) {
            console.error('Error fetching starred items:', error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStarredItems();

        // Listen for refresh events
        const handleRefresh = () => fetchStarredItems();
        window.addEventListener('refresh-files', handleRefresh);

        return () => window.removeEventListener('refresh-files', handleRefresh);
    }, []);

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
    } = useDriveItems(items);

    const handleItemDoubleClick = (item) => {
        if (item.type === DATA_TYPES.FOLDER || item.type === DATA_TYPES.SHARED_FOLDER) {
            navigate(ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', item.id));
        } else {
            usePreviewStore.getState().setPreviewFile(item);
        }
    };

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

    // Check if starred is truly empty vs filter showing no results
    const isStarredEmpty = !isLoading && items.length === 0;
    const hasNoFilterResults = !isLoading && items.length > 0 && sortedItems.length === 0;

    // Show empty state without header only if no starred items exist
    // Show empty state WITH header if no starred items exist
    if (isStarredEmpty) {
        return (
            <div className="h-full bg-white text-slate-900 p-6 flex flex-col">
                <PageHeader
                    selectedItemIds={selectedItemIds}
                    onClearSelection={() => setSelectedItemIds([])}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    filters={defaultFilters}
                    showFilters={true}
                    showViewToggle={true}
                    onDownload={handleDownloadSelected}
                />
                <EmptyState
                    icon={Star}
                    title="No starred files"
                    description="Add stars to things that you want to easily find later"
                    iconClassName="text-amber-400"
                />
            </div>
        );
    }

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
                filters={defaultFilters}
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
                /* File List/Grid View */
                <FileListView
                    isLoading={isLoading}
                    items={sortedItems}
                    viewMode={viewMode}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    selectedItemIds={selectedItemIds}
                    onItemClick={handleItemClick}
                    onItemDoubleClick={handleItemDoubleClick}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    menuRef={menuRef}
                    getIcon={getIcon}
                    columns={['name', 'owner', 'modified', 'size', 'location']}
                />
            )}
        </div>
    );
}
