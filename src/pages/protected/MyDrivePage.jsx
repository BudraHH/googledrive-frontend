import { useState, useEffect } from 'react';
import { HardDrive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { usePreviewStore } from "@/stores/usePreviewStore";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import FileListView from "@/components/shared/FileListView";
import { DATA_TYPES } from "@/constants/appConstants";
import { useDriveItems } from "@/hooks/useDriveItems.jsx";
import { filesAPI } from '@/services/api/filesAPI';
import { useToast } from "@/hooks/use-toast";

export default function MyDrivePage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await filesAPI.getItems(null); // Root
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch My Drive items", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchDelete = async () => {
        if (!selectedItemIds.length) return;

        try {
            await Promise.all(selectedItemIds.map(id => filesAPI.trash(id)));
            // Show toast properly with an import (assumed available or add import)
            // toast.success(`${selectedItemIds.length} items moved to bin`); 
            setSelectedItemIds([]);
            fetchItems();
        } catch (error) {
            console.error("Delete failed", error);
            // toast.error("Failed to delete items");
        }
    };

    const handleBatchDownload = async () => {
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

    const handleGetLink = () => {
        if (!selectedItemIds.length) return;

        const id = selectedItemIds[0];
        const item = items.find(i => (i.id || i._id) === id);

        if (!item) return;

        const baseUrl = window.location.origin;
        let link = "";

        // Check if folder
        if (item.type === DATA_TYPES.FOLDER || item.type === 'folder' || item.type === DATA_TYPES.SHARED_FOLDER) {
            link = `${baseUrl}/drive/folders/${id}`;
        } else {
            // File format
            link = `${baseUrl}/file/d/${id}/view?usp=drive_link`;
        }

        navigator.clipboard.writeText(link);
        alert("Link copied to clipboard");
        setSelectedItemIds([]);
    }

    useEffect(() => {
        fetchItems();

        const handleRefresh = () => fetchItems();
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
        if (item.type === DATA_TYPES.FOLDER || item.type === 'folder') {
            navigate(ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', item.id));
        } else {
            usePreviewStore.getState().setPreviewFile(item);
        }
    };

    // Check if drive is truly empty (no items from API) vs filter showing no results
    const isDriveEmpty = !loading && items.length === 0;
    const hasNoFilterResults = !loading && items.length > 0 && sortedItems.length === 0;

    // Show empty state without header only if drive is truly empty
    if (isDriveEmpty) {
        return (
            <div className="h-full bg-white text-slate-900 p-6">
                <EmptyState
                    icon={HardDrive}
                    title="Your Drive is empty"
                    description="Upload your first file or create a folder to get started organizing your files"
                    actionLabel="Upload file"
                    showAction={true}
                    onAction={() => console.log('Upload file clicked')}
                    iconClassName="text-brand-400"
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
                // Action Handlers
                onShare={() => alert("Share functionality coming soon!")}
                onDownload={handleBatchDownload}
                onMove={() => alert("Move functionality coming soon!")}
                onDelete={handleBatchDelete}
                onGetLink={handleGetLink}
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
                    isLoading={loading}
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
                    columns={['name', 'owner', 'modified', 'size']}
                />
            )}

        </div>
    );
}
