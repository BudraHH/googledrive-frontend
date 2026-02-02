import {
    X,
    Sparkles,
    UserPlus,
    Download,
    FolderInput,
    Trash2,
    Link,
    MoreHorizontal,
    List,
    LayoutGrid,
    RotateCcw
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";

export default function PageHeader({
    selectedItemIds = [],
    onClearSelection,
    viewMode = 'list',
    onViewModeChange,
    filterConfig = {},
    onFilterChange,
    filters = [],
    showFilters = true,
    showViewToggle = true,
    onShare,
    onDownload,
    onMove,
    onDelete,
    onGetLink,
    isTrashView = false,
    onRestore,
    onDeleteForever
}) {
    const handleFilterChange = (filterType, value) => {
        if (onFilterChange) {
            onFilterChange(filterType, value);
        }
    };

    const clearAllFilters = () => {
        if (onFilterChange) {
            filters.forEach(f => {
                onFilterChange(f.key, null);
            });
        }
    };

    return (
        <div className="flex items-center justify-between mb-6">
            {/* Filters or Selection Toolbar */}
            <div className="flex gap-2 mb-4 items-center">
                {selectedItemIds.length > 0 ? (
                    /* Selection Toolbar */
                    <div className="flex items-center gap-3 rounded border bg-slate-50 border-slate-200  px-1 py-0.5 ">
                        {/* Close button and count */}
                        <button
                            onClick={onClearSelection}
                            className="hover:bg-slate-200 rounded p-1 transition-colors"
                        >
                            <X size={18} className="text-slate-700" />
                        </button>
                        <span className="text-sm font-medium text-slate-700">
                            {selectedItemIds.length} selected
                        </span>

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-300" />

                        {/* Delete Forever (Trash view) */}
                        {isTrashView && (
                            <>
                                <button
                                    onClick={onRestore}
                                    className="hover:bg-slate-200 rounded p-1.5 transition-colors"
                                    title="Restore"
                                >
                                    <RotateCcw size={18} className="text-slate-700" />
                                </button>
                                <button
                                    onClick={onDeleteForever}
                                    className="hover:bg-slate-200 rounded p-1.5 transition-colors"
                                    title="Delete forever"
                                >
                                    <Trash2 size={18} className="text-slate-700" />
                                </button>
                            </>
                        )}

                        {/* Standard Actions (Non-Trash view) */}
                        {!isTrashView && (
                            <>
                                <button
                                    onClick={onShare}
                                    className="hover:bg-slate-200 rounded p-1.5 transition-colors"
                                    title="Share"
                                >
                                    <UserPlus size={18} className="text-slate-700" />
                                </button>

                                <button
                                    onClick={onDownload}
                                    className="hover:bg-slate-200 rounded p-1.5 transition-colors"
                                    title="Download"
                                >
                                    <Download size={18} className="text-slate-700" />
                                </button>

                                <button
                                    onClick={onMove}
                                    className="hover:bg-slate-200 rounded p-1.5 transition-colors"
                                    title="Move to"
                                >
                                    <FolderInput size={18} className="text-slate-700" />
                                </button>

                                <button
                                    onClick={onDelete}
                                    className="hover:bg-slate-200 rounded p-1.5 transition-colors"
                                    title="Move to bin"
                                >
                                    <Trash2 size={18} className="text-slate-700" />
                                </button>

                                <button
                                    onClick={onGetLink}
                                    className="hover:bg-slate-200 rounded p-1.5 transition-colors"
                                    title="Get link"
                                >
                                    <Link size={18} className="text-slate-700" />
                                </button>
                            </>
                        )}

                    </div>
                ) : (
                    /* Filters */
                    showFilters && (
                        <>
                            {filters.map((f) => {
                                const isActive = filterConfig[f.key] !== null;
                                const activeValue = filterConfig[f.key];

                                return (
                                    <div key={f.label} className="relative">
                                        <Select
                                            value={activeValue || undefined}
                                            onValueChange={(value) => handleFilterChange(f.key, value)}
                                        >
                                            <SelectTrigger
                                                className={`w-fit min-w-[100px] h-9 px-3 py-1.5 text-sm border rounded hover:bg-slate-50 shadow-none ${isActive
                                                    ? 'bg-slate-100 border-slate-200 text-slate-700 pr-8'
                                                    : 'bg-white border-slate-200 text-slate-600'
                                                    }`}
                                            >
                                                {isActive ? (
                                                    <span className="capitalize">{activeValue}</span>
                                                ) : (
                                                    <span>{f.label}</span>
                                                )}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {f.options.map((option) => (
                                                    <SelectItem key={option} value={option.toLowerCase()}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isActive && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFilterChange(f.key, null);
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-500 hover:text-brand-600 transition-colors"
                                            >
                                                <X size={14} strokeWidth={2.5} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Clear all filters button */}
                            {Object.values(filterConfig).some(v => v !== null) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="ml-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                                >
                                    Clear filters
                                </button>
                            )}
                        </>
                    )
                )}
            </div>

            {/* View Mode Toggle */}
            {showViewToggle && (
                <div className="flex items-center gap-3">
                    <div className="flex border border-slate-200 rounded overflow-hidden">
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`px-3 py-1.5 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`px-3 py-1.5 ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
