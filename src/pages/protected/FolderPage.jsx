import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HardDrive } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import FileListView from "@/components/shared/FileListView";
import { DATA_TYPES } from "@/constants/appConstants";
import { useDriveItems } from "@/hooks/useDriveItems.jsx";
import { useFileUpload } from '@/hooks/useFileUpload';
import { ROUTES } from '@/routes/routes';
import { filesAPI } from '@/services/api/filesAPI';
import { useToast } from '@/hooks/use-toast';
import { usePreviewStore } from "@/stores/usePreviewStore";

export default function FolderPage() {
    const { toast } = useToast();
    const { folderId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [currentFolder, setCurrentFolder] = React.useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await filesAPI.getItems(folderId);
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch folder contents:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();

        const handleRefresh = () => fetchData();
        window.addEventListener('refresh-files', handleRefresh);

        return () => window.removeEventListener('refresh-files', handleRefresh);
    }, [folderId]);

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
            // Preview
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

    // Enable Drag & Drop for this folder
    const { dragProps, isDragging } = useFileUpload(folderId);

    // Clear selection when navigating between folders
    useEffect(() => {
        setSelectedItemIds([]);
    }, [folderId, setSelectedItemIds]);

    return (
        <div
            {...dragProps}
            className={`h-full bg-white text-slate-900 p-6 flex flex-col relative ${isDragging ? 'ring-4 ring-brand-500/20' : ''}`}
        >
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
                title={currentFolder ? currentFolder.name : 'Folder'}
                onDownload={handleDownloadSelected}
                onDelete={async () => {
                    if (!selectedItemIds.length) return;
                    try {
                        await Promise.all(selectedItemIds.map(id => filesAPI.trash(id)));
                        toast({ title: "Moved to bin", description: `${selectedItemIds.length} item(s) moved to bin` });
                        setSelectedItemIds([]);
                        fetchData();
                    } catch (error) {
                        toast({ title: "Error", description: "Failed to move items to bin", variant: "destructive" });
                    }
                }}
                onShare={() => console.log('Share')}
                onMove={() => console.log('Move')}
                onGetLink={() => {
                    if (!selectedItemIds.length) return;
                    const id = selectedItemIds[0]; // Just first one for now
                    const link = `${window.location.origin}/file/d/${id}/view?usp=drive_link`;
                    navigator.clipboard.writeText(link);
                    toast({ title: "Link copied", description: "Link copied to clipboard" });
                    setSelectedItemIds([]);
                }}
            />

            {sortedItems.length === 0 ? (
                <EmptyState
                    icon={HardDrive}
                    title="Drop files here"
                    description="or use the 'New' button."
                    actionLabel="Upload file"
                    showAction={false}
                    onAction={() => console.log('Upload file clicked')}
                    iconClassName="text-brand-400"
                />
            ) : (
                <FileListView
                    isLoading={false}
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
