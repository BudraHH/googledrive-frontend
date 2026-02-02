import { useState, useRef, useEffect } from "react";
import {
    Folder,
    FolderOpen,
    Users,
    ImageIcon,
    FileSpreadsheet,
    FileText,
    Upload,
    RefreshCw,
    FileCode,
    BookOpen,
} from "lucide-react";
import { DATA_TYPES, defaultFilterConfig } from "@/constants/appConstants";

/**
 * Custom hook for managing drive items (sorting, filtering, selection, etc.)
 * Used across MyDrive, Recent, Starred, and Trash pages
 */
export function useDriveItems(initialItems = []) {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [filterConfig, setFilterConfig] = useState(defaultFilterConfig);
    const [viewMode, setViewMode] = useState('list');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const menuRef = useRef(null);

    const [items, setItems] = useState(initialItems);

    // Update items when initialItems prop changes (e.g. navigation between folders)
    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        setFilterConfig(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Apply filters
    const filteredItems = items.filter(item => {
        // Type filter
        if (filterConfig.type) {
            const typeMap = {
                'folders': DATA_TYPES.FOLDER,
                'pdfs': DATA_TYPES.PDF,
                'images': DATA_TYPES.IMAGE,
                'spreadsheets': DATA_TYPES.SPREADSHEET,
                'documents': DATA_TYPES.DOCUMENT,
            };

            // Check if item type matches any folder type
            if (filterConfig.type === 'folders') {
                const folderTypes = [
                    DATA_TYPES.FOLDER,
                    DATA_TYPES.SHARED_FOLDER,
                    DATA_TYPES.IMPORTED_FOLDER,
                    DATA_TYPES.SYNCED_FOLDER
                ];
                if (!folderTypes.includes(item.type)) return false;
            } else if (item.type !== typeMap[filterConfig.type]) {
                return false;
            }
        }

        // People filter
        if (filterConfig.people) {
            if (filterConfig.people === 'me' && item.owner !== 'me') return false;
            // 'anyone' shows all
        }

        // Source filter
        if (filterConfig.source) {
            const sourceMap = {
                'my drive': 'My Drive',
                'shared with me': 'Shared with me'
            };
            if (item.source !== sourceMap[filterConfig.source]) return false;
        }

        // Modified filter (simplified - you can enhance this with actual date logic)
        // For now, this is a placeholder that shows all items

        return true;
    });

    // Apply sorting to filtered items
    // Apply sorting to filtered items
    const sortedItems = [...filteredItems].sort((a, b) => {
        // Helper to identify folders
        const isFolder = (type) => [
            DATA_TYPES.FOLDER,
            DATA_TYPES.SHARED_FOLDER,
            DATA_TYPES.IMPORTED_FOLDER,
            DATA_TYPES.SYNCED_FOLDER
        ].includes(type);

        const aIsFolder = isFolder(a.type);
        const bIsFolder = isFolder(b.type);

        // Always prioritize folders on top
        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;

        // Sort items of the same group (folder-folder or file-file)
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Handle string comparison nicely (case-insensitive)
        if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Get icon based on item type
    const getIcon = (item) => {

        const type = item.type;
        const name = item.name?.toLowerCase() || '';

        // Check by DATA_TYPE (numeric) first
        switch (type) {
            case DATA_TYPES.FOLDER:
                return <Folder size={18} className="text-slate-600" />;
            case DATA_TYPES.SHARED_FOLDER:
                return <FolderOpen size={18} className="text-blue-600" />;
            case DATA_TYPES.IMPORTED_FOLDER:
                return <Upload size={18} className="text-purple-600" />;
            case DATA_TYPES.SYNCED_FOLDER:
                return <RefreshCw size={18} className="text-green-600" />;
            case DATA_TYPES.IMAGE:
                return <ImageIcon size={16} className="text-rose-500" />;
            case DATA_TYPES.SPREADSHEET:
                return <FileSpreadsheet size={16} className="text-indigo-500" />;
            case DATA_TYPES.PDF:
                return <FileText size={16} className="text-red-500" />;
            case DATA_TYPES.DOCUMENT:
                return <FileText size={16} className="text-blue-500" />;
            case DATA_TYPES.CODE:
                return <FileCode size={16} className="text-green-500" />;
            case DATA_TYPES.NOTEBOOK:
                return <BookOpen size={16} className="text-orange-500" />;
        }

        // Check for string type values (from API)
        if (type === 'folder') {
            return <Folder size={18} className="text-slate-600" />;
        }

        // Fallback: infer from file extension
        if (name.endsWith('.pdf')) {
            return <FileText size={16} className="text-red-500" />;
        }
        if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.rtf')) {
            return <FileText size={16} className="text-slate-500" />;
        }
        if (name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.odt')) {
            return <FileText size={16} className="text-blue-500" />;
        }
        if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) {
            return <FileSpreadsheet size={16} className="text-indigo-500" />;
        }
        if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') ||
            name.endsWith('.gif') || name.endsWith('.webp') || name.endsWith('.svg')) {
            return <ImageIcon size={16} className="text-rose-500" />;
        }
        if (name.endsWith('.ipynb')) {
            return <BookOpen size={16} className="text-orange-500" />;
        }
        if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.py') ||
            name.endsWith('.java') || name.endsWith('.cpp') || name.endsWith('.c') ||
            name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.json')) {
            return <FileCode size={16} className="text-green-500" />;
        }

        // Default
        return <FileText size={16} className="text-slate-400" />;
    };

    // Handle item click (selection)
    const handleItemClick = (itemId, event) => {
        // Check if Ctrl (Windows/Linux) or Cmd (Mac) key is pressed
        if (event.ctrlKey || event.metaKey) {
            // Multi-select mode
            setSelectedItemIds(prev => {
                if (prev.includes(itemId)) {
                    // Remove if already selected
                    return prev.filter(id => id !== itemId);
                } else {
                    // Add to selection
                    return [...prev, itemId];
                }
            });
        } else {
            // Single select mode
            setSelectedItemIds([itemId]);
        }
    };

    // Default filter options (can be overridden per page)
    const defaultFilters = [
        { label: "Type", key: "type", options: ["Folders", "PDFs", "Images", "Spreadsheets", "Documents"] },
        { label: "People", key: "people", options: ["Me", "Anyone"] },
        { label: "Modified", key: "modified", options: ["Today", "Last 7 days", "Last 30 days", "This year"] },
        { label: "Source", key: "source", options: ["My Drive", "Shared with me"] },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return {
        // State
        items,
        sortedItems,
        filteredItems,
        sortConfig,
        filterConfig,
        viewMode,
        openMenuId,
        selectedItemIds,
        menuRef,

        // Setters
        setViewMode,
        setOpenMenuId,
        setSelectedItemIds,
        setSortConfig,
        setFilterConfig,

        // Handlers
        handleSort,
        handleFilterChange,
        handleItemClick,
        getIcon,

        // Defaults
        defaultFilters,
    };
}
