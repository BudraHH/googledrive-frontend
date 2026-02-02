import React, { useState, useEffect } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import FileListView from "@/components/shared/FileListView";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { DATA_TYPES } from "@/constants/appConstants";
import { useDriveItems } from "@/hooks/useDriveItems.jsx";
import { Button } from "@/components/ui/button";
import { filesAPI } from "@/services/api/filesAPI";
import { useToast } from "@/hooks/use-toast";

export default function TrashPage() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Bin' }]);

    const fetchTrashedItems = async () => {
        try {
            setIsLoading(true);
            let data;

            if (currentFolderId) {
                // Fetch contents of trashed folder
                // We use standard getItems but with trash=true flag to see inside trashed folders
                data = await filesAPI.getItems(currentFolderId, true);
            } else {
                // Fetch top-level trash
                data = await filesAPI.getTrashedItems();
            }

            setItems(data);
        } catch (error) {
            console.error('Error fetching trashed items:', error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrashedItems();

        // Listen for refresh events
        const handleRefresh = () => fetchTrashedItems();
        window.addEventListener('refresh-files', handleRefresh);

        return () => window.removeEventListener('refresh-files', handleRefresh);
    }, [currentFolderId]);

    const handleItemDoubleClick = (item) => {
        if (item.type === DATA_TYPES.FOLDER || item.type === DATA_TYPES.SHARED_FOLDER) {
            setCurrentFolderId(item._id);
            setBreadcrumbs(prev => [...prev, { id: item._id, name: item.name }]);
        }
    };

    const handleBreadcrumbClick = (index) => {
        const target = breadcrumbs[index];
        setCurrentFolderId(target.id);
        setBreadcrumbs(prev => prev.slice(0, index + 1));
    };

    const [isEmptying, setIsEmptying] = useState(false);
    const { toast } = useToast();

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
    } = useDriveItems(items);

    // Empty entire bin
    const handleEmptyBin = async () => {
        if (!confirm('Are you sure you want to permanently delete all items in the bin? This cannot be undone.')) {
            return;
        }

        try {
            setIsEmptying(true);

            // Delete all items (in current view? or truly all?)
            // If inside a folder, we probably only want to empty THAT folder or disable this button?
            // "Empty bin" usually means empty EVERYTHING in trash, regardless of view.
            if (currentFolderId) {
                toast({
                    title: "Action not supported",
                    description: "Go to root of Bin to empty all trash",
                    variant: "default"
                });
                return;
            }

            // Fetch ALL trashed items to be sure we get everything, not just roots?
            // Actually, getTrashedItems() now returns roots.
            // If we delete a root folder permanently, its children are deleted by backend logic (cascade).
            // So iterating roots is sufficient.
            const roots = await filesAPI.getTrashedItems();

            for (const item of roots) {
                await filesAPI.deleteForever(item._id);
            }

            toast({
                title: "Bin emptied",
                description: "All items have been permanently deleted"
            });

            fetchTrashedItems();
        } catch (error) {
            console.error('Error emptying bin:', error);
            toast({
                title: "Error",
                description: "Failed to empty bin",
                variant: "destructive"
            });
        } finally {
            setIsEmptying(false);
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedItemIds.length === 0) return;

        for (const id of selectedItemIds) {
            const item = items.find(i => (i.id === id || i._id === id));
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
    };

    const handleRestoreSelected = async () => {
        if (!selectedItemIds.length) return;
        try {
            await Promise.all(selectedItemIds.map(id => filesAPI.restore(id)));
            toast({
                title: "Restored",
                description: `${selectedItemIds.length} item(s) restored`
            });
            setSelectedItemIds([]);
            fetchTrashedItems();
        } catch (error) {
            console.error("Restore failed", error);
            toast({
                title: "Error",
                description: "Failed to restore items",
                variant: "destructive"
            });
        }
    };

    const handleDeleteForeverSelected = async () => {
        if (!selectedItemIds.length) return;
        if (!confirm(`Are you sure you want to delete ${selectedItemIds.length} item(s) forever?`)) return;

        try {
            await Promise.all(selectedItemIds.map(id => filesAPI.deleteForever(id)));
            toast({
                title: "Deleted forever",
                description: `${selectedItemIds.length} item(s) deleted permanently`
            });
            setSelectedItemIds([]);
            fetchTrashedItems();
        } catch (error) {
            console.error("Delete failed", error);
            toast({
                title: "Error",
                description: "Failed to delete items",
                variant: "destructive"
            });
        }
    };

    // Trash-specific filters
    const trashFilters = [
        { label: "Type", key: "type", options: ["Files", "Folders", "PDFs", "Images"] },
        { label: "Modified", key: "modified", options: ["Today", "Last 7 days", "Last 30 days"] },
        { label: "Source", key: "source", options: ["My Drive", "Shared with me"] },
    ];

    // Check if bin is truly empty vs filter showing no results
    const isBinEmpty = !isLoading && items.length === 0;
    const hasNoFilterResults = !isLoading && items.length > 0 && sortedItems.length === 0;

    // Show empty state without header only if bin is truly empty
    if (isBinEmpty) {
        return (
            <div className="h-full bg-white text-slate-900 p-6">
                <EmptyState
                    icon={Trash2}
                    title="Bin is empty"
                    description="Items moved to the bin will be deleted forever after 30 days"
                    iconClassName="text-slate-400"
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-white text-slate-900 p-6 flex flex-col">


            {/* Info Banner */}
            {!currentFolderId && (
                <div className="mb-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-amber-900 font-medium">
                            Items in bin will be deleted forever after 30 days
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                            You can restore items before they are permanently deleted
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 text-sm font-medium"
                        onClick={handleEmptyBin}
                        disabled={isEmptying}
                    >
                        {isEmptying ? 'Emptying...' : 'Empty bin'}
                    </Button>
                </div>
            )}

            {/* Header */}
            <PageHeader
                selectedItemIds={selectedItemIds}
                onClearSelection={() => setSelectedItemIds([])}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                filters={trashFilters}
                showFilters={true}
                showViewToggle={true}
                isTrashView={true}
                onRestore={handleRestoreSelected}
                onDeleteForever={handleDeleteForeverSelected}
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
                    columns={['name', 'owner', 'dateBinned', 'size', 'location']}
                />
            )}
        </div>
    );
}
