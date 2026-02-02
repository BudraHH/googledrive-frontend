import { CircleAlert } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import FileListView from "@/components/shared/FileListView";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { DATA_TYPES } from "@/constants/appConstants";
import { useDriveItems } from "@/hooks/useDriveItems.jsx";

const EMPTY_ARRAY = [];

export default function SpamPage() {
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
    } = useDriveItems(EMPTY_ARRAY);
    const navigate = useNavigate();

    const handleItemDoubleClick = (item) => {
        if (item.type === DATA_TYPES.FOLDER || item.type === DATA_TYPES.SHARED_FOLDER) {
            navigate(ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', item.id));
        }
    };

    // Spam-specific filters
    const spamFilters = [
        { label: "Type", key: "type", options: ["Folders", "PDFs", "Images", "Files"] },
        { label: "People", key: "people", options: ["Me", "Anyone"] },
    ];

    // Show empty state if no items
    if (sortedItems.length === 0) {
        return (
            <div className="h-full bg-white text-slate-900 p-6">
                <EmptyState
                    title="Your spam is empty"
                    description="Files in spam won't appear anywhere else in Drive. Files are permanently removed after 30 days."
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-white text-slate-900 p-6 flex flex-col">
            {/* Info Banner */}
            <div className="mb-4 flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">
                        Items in spam will be deleted forever after 30 days
                    </p>
                </div>
            </div>

            {/* Header */}
            <PageHeader
                selectedItemIds={selectedItemIds}
                onClearSelection={() => setSelectedItemIds([])}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
                filters={spamFilters}
                showFilters={true}
                showViewToggle={true}
            />

            {/* File List/Grid View */}
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
        </div>
    );
}
