// Mock data for Google Drive clone
// Single source of truth with mutation_type flags to indicate item states

export const MUTATION_TYPES = {
    NOTHING: 0,
    STARRED: 1,
    TRASHED: 2,
    SPAM: 3,
}

export const DATA_TYPES = {
    // Folders (different icons)
    FOLDER: 0,              // 📁 Regular folder (created by user)
    SHARED_FOLDER: 1,       // 👥 Folder shared with you
    IMPORTED_FOLDER: 2,     // 💾 Folder imported/uploaded
    SYNCED_FOLDER: 3,       // 💻 Synced from computer

    // Documents
    DOCUMENT: 4,            // Google Docs, .docx, .txt
    SPREADSHEET: 5,         // Google Sheets, .xlsx, .csv
    PRESENTATION: 6,        // Google Slides, .pptx
    PDF: 7,                 // .pdf files

    // Media
    IMAGE: 8,               // .jpg, .png, .gif, etc.
    VIDEO: 9,               // .mp4, .mov, etc.
    AUDIO: 10,              // .mp3, .wav, etc.

    // Code & Data
    CODE: 11,               // .js, .py, .java, etc.
    NOTEBOOK: 12,           // .ipynb (Jupyter notebooks)

    // Archive & Other
    ARCHIVE: 13,            // .zip, .rar, etc.
    OTHER: 99,              // Unknown/other file types
}


// Master list of all items
export const allItems = [
    // My Drive items
    { id: 1, name: "Os isos", type: DATA_TYPES.FOLDER, owner: "me", modifiedDate: "16 Apr 2025", modifiedTime: "Last month", size: "--", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 2, name: "Photos", type: DATA_TYPES.FOLDER, owner: "me", modifiedDate: "22 Apr 2020", modifiedTime: "Earlier", size: "--", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 3, name: "Resume", type: DATA_TYPES.FOLDER, owner: 'me', modifiedDate: "19 Apr 2024", modifiedTime: "Last year", size: "--", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 4, name: "Vami", type: DATA_TYPES.SHARED_FOLDER, owner: "me", modifiedDate: "10 Aug 2020", modifiedTime: "Earlier", size: "--", isUser: true, source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 5, name: "clg id.jpg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "31 Oct 2025", modifiedTime: "Last month", size: "127 KB", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 2 },
    { id: 6, name: "resume.pdf", type: DATA_TYPES.PDF, owner: "me", modifiedDate: "27 Oct 2025", modifiedTime: "Last month", size: "102 KB", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 3 },

    // Recent items (with group and modifiedTime)
    { id: 7, name: "Yesterday", type: DATA_TYPES.FOLDER, owner: "me", modifiedDate: "30 Jan 2026", modifiedTime: "Yesterday", size: "--", location: "My Drive", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 8, name: "Linear_Regression_practice.ipynb", type: DATA_TYPES.NOTEBOOK, owner: "me", modifiedDate: "30 Jan • Opened by me", modifiedTime: "Yesterday", size: "26 KB", location: "Colab Notebooks", source: "My Drive", fileIcon: "jupyter", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 9, name: "Twitter_Data_Sentimental_Analysis.ipynb", type: DATA_TYPES.NOTEBOOK, owner: "me", modifiedDate: "24 Jan • Modified by me", modifiedTime: "Last week", size: "66 KB", location: "Colab Notebooks", source: "My Drive", fileIcon: "jupyter", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 10, name: "NLP_practice.ipynb", type: DATA_TYPES.NOTEBOOK, owner: "me", modifiedDate: "24 Jan • Modified by me", modifiedTime: "Last week", size: "1.9 KB", location: "Colab Notebooks", source: "My Drive", fileIcon: "jupyter", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 11, name: "Associate Software Developer - Kolkata", type: DATA_TYPES.PDF, owner: "me", modifiedDate: "23 Jan • Modified by me", modifiedTime: "Last week", size: "154 KB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 2 },
    { id: 12, name: "Untitled0.ipynb", type: DATA_TYPES.NOTEBOOK, owner: "me", modifiedDate: "23 Jan • Opened by me", modifiedTime: "Last week", size: "354 bytes", location: "Colab Notebooks", source: "My Drive", fileIcon: "jupyter", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 4 },
    { id: 13, name: "camera.jpeg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "23 Jan • Uploaded", modifiedTime: "Last week", size: "32 KB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 1 },
    { id: 14, name: "camera.jpeg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "23 Jan • Uploaded", modifiedTime: "Last week", size: "34 KB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 1 },
    { id: 15, name: "Buffer For Raw Binary Data", type: DATA_TYPES.OTHER, owner: "me", modifiedDate: "23 Jan • Modified by me", modifiedTime: "Last week", size: "318 GB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 16, name: "camera.jpeg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "23 Jan • Uploaded", modifiedTime: "Last week", size: "31 KB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 7 },
    { id: 17, name: "camera.jpeg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "23 Jan • Uploaded", modifiedTime: "Last week", size: "31 KB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 7 },
    { id: 18, name: "camera.jpeg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "23 Jan • Uploaded", modifiedTime: "Last week", size: "33 KB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 19, name: "camera.jpeg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "23 Jan • Uploaded", modifiedTime: "Last week", size: "56 KB", location: "Google AI Studio", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },

    // Starred items
    { id: 20, name: "Important Project", type: DATA_TYPES.FOLDER, owner: "me", modifiedDate: "16 Apr 2025", modifiedTime: "Last month", size: "--", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.STARRED, parent_id: null },
    { id: 21, name: "Presentation.pdf", type: DATA_TYPES.PDF, owner: "me", modifiedDate: "22 Apr 2020", modifiedTime: "Earlier", size: "2.4 MB", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.STARRED, parent_id: null },
    { id: 22, name: "Budget 2025", type: DATA_TYPES.SPREADSHEET, owner: 'me', modifiedDate: "19 Apr 2024", modifiedTime: "Last year", size: "156 KB", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.STARRED, parent_id: null },
    { id: 23, name: "Team Photo.jpg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "10 Aug 2020", modifiedTime: "Earlier", size: "3.2 MB", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.STARRED, parent_id: null },

    // Trashed items
    { id: 24, name: "Old Project", type: DATA_TYPES.FOLDER, owner: "me", modifiedDate: "10 Jan 2026", modifiedTime: "Last month", size: "--", source: "My Drive", deletedDate: "10 Jan 2026", mutation_type: MUTATION_TYPES.TRASHED, parent_id: null },
    { id: 25, name: "Draft Document.pdf", type: DATA_TYPES.PDF, owner: "me", modifiedDate: "05 Jan 2026", modifiedTime: "Last month", size: "1.2 MB", source: "My Drive", deletedDate: "05 Jan 2026", mutation_type: MUTATION_TYPES.TRASHED, parent_id: null },
    { id: 26, name: "Unused Image.jpg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "28 Dec 2025", modifiedTime: "Last month", size: "856 KB", source: "My Drive", deletedDate: "28 Dec 2025", mutation_type: MUTATION_TYPES.TRASHED, parent_id: null },
    { id: 27, name: "Test Spreadsheet", type: DATA_TYPES.SPREADSHEET, owner: "me", modifiedDate: "20 Dec 2025", modifiedTime: "Last month", size: "45 KB", source: "My Drive", deletedDate: "20 Dec 2025", mutation_type: MUTATION_TYPES.TRASHED, parent_id: null },

    // Shared with me items
    { id: 28, name: "Team Presentation", type: DATA_TYPES.SHARED_FOLDER, owner: "John Doe", modifiedDate: "25 Jan 2026", modifiedTime: "Last week", size: "--", source: "Shared with me", sharedBy: "john.doe@example.com", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 29, name: "Q4 Report.pdf", type: DATA_TYPES.PDF, owner: "Jane Smith", modifiedDate: "20 Jan 2026", modifiedTime: "Last week", size: "3.5 MB", source: "Shared with me", sharedBy: "jane.smith@example.com", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 30, name: "Marketing Assets", type: DATA_TYPES.SHARED_FOLDER, owner: "Marketing Team", modifiedDate: "15 Jan 2026", modifiedTime: "Last week", size: "--", source: "Shared with me", sharedBy: "marketing@example.com", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    { id: 31, name: "Budget Analysis", type: DATA_TYPES.SPREADSHEET, owner: "Finance Dept", modifiedDate: "10 Jan 2026", modifiedTime: "Last week", size: "892 KB", source: "Shared with me", sharedBy: "finance@example.com", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: null },
    // Nested Testing Items
    { id: 32, name: "Sub Folder", type: DATA_TYPES.FOLDER, owner: "me", modifiedDate: "25 Jan 2026", modifiedTime: "Last week", size: "--", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 2 },
    { id: 33, name: "Deep Nested Image.jpg", type: DATA_TYPES.IMAGE, owner: "me", modifiedDate: "25 Jan 2026", modifiedTime: "Last week", size: "1.2 MB", source: "My Drive", deletedDate: null, mutation_type: MUTATION_TYPES.NOTHING, parent_id: 32 },
];

// Filtered exports based on mutation_type and other criteria

// My Drive items (not trashed, owned by me, from My Drive source, and is root item)
export const myDriveItems = allItems.filter(item =>
    item.mutation_type !== MUTATION_TYPES.TRASHED &&
    item.owner === "me" &&
    item.source === "My Drive" &&
    item.parent_id === null
);

// Recent items (all items with mutation_type: NOTHING, grouped by modifiedTime)
export const recentItems = allItems.filter(item =>
    item.mutation_type === MUTATION_TYPES.NOTHING
);

// Starred items
export const starredItems = allItems.filter(item =>
    item.mutation_type === MUTATION_TYPES.STARRED
);

// Trash items
export const trashItems = allItems.filter(item =>
    item.mutation_type === MUTATION_TYPES.TRASHED
);

// Spam items
export const spamItems = allItems.filter(item =>
    item.mutation_type === MUTATION_TYPES.SPAM
);

// Shared with me items
export const sharedItems = allItems.filter(item =>
    item.source === "Shared with me" &&
    item.mutation_type !== MUTATION_TYPES.TRASHED
);

// Storage usage data
export const storageData = {
    used: 8.5, // GB
    total: 15, // GB
    breakdown: {
        drive: 5.2,
        gmail: 2.1,
        photos: 1.2
    }
};

// Filter options (common across pages)
export const filterOptions = {
    type: ["Folders", "PDFs", "Images", "Spreadsheets", "Documents"],
    people: ["Me", "Anyone", "Specific person"],
    modified: ["Today", "Last 7 days", "Last 30 days", "This year", "Last year"],
    source: ["My Drive", "Shared with me", "Computers"]
};

// Default filter configuration
export const defaultFilterConfig = {
    type: null,
    people: null,
    modified: null,
    source: null
};

// Helper function to get items by page type
export const getItemsByPage = (pageType) => {
    switch (pageType) {
        case 'myDrive':
            return myDriveItems;
        case 'recent':
            return recentItems;
        case 'starred':
            return starredItems;
        case 'trash':
            return trashItems;
        case 'shared':
            return sharedItems;
        default:
            return [];
    }
};

// Helper function to group items by modifiedTime (useful for Recent page)
// Helper function to group items by modifiedTime (useful for Recent page)
export const groupItemsByTime = (items) => {
    // Define strict order of groups
    const timeOrder = [
        'Today',
        'Yesterday',
        'Last week',
        'Earlier this month',
        'Last month',
        'Older',
        'Never'
    ];

    const groups = {};

    // Initialize groups
    timeOrder.forEach(key => {
        groups[key] = [];
    });
    groups['Other'] = [];

    items.forEach(item => {
        const timeGroup = item.modifiedTime || 'Other';
        if (groups.hasOwnProperty(timeGroup)) {
            groups[timeGroup].push(item);
        } else {
            groups['Other'].push(item);
        }
    });

    // Convert to ordered array, filtering out empty groups
    const result = [];

    // Iterate strictly in defined order
    timeOrder.forEach(key => {
        if (groups[key].length > 0) {
            result.push({ name: key, items: groups[key] });
        }
    });

    // Add Other if not empty
    if (groups['Other'].length > 0) {
        result.push({ name: 'Other', items: groups['Other'] });
    }

    return result;
};

// Helper function to star/unstar an item (for future use)
export const toggleStar = (itemId, items) => {
    return items.map(item => {
        if (item.id === itemId) {
            return {
                ...item,
                mutation_type: item.mutation_type === MUTATION_TYPES.STARRED ? MUTATION_TYPES.NOTHING : MUTATION_TYPES.STARRED
            };
        }
        return item;
    });
};

// Helper function to trash/restore an item (for future use)
export const toggleTrash = (itemId, items) => {
    return items.map(item => {
        if (item.id === itemId) {
            const isCurrentlyTrashed = item.mutation_type === MUTATION_TYPES.TRASHED;
            return {
                ...item,
                mutation_type: isCurrentlyTrashed ? MUTATION_TYPES.NOTHING : MUTATION_TYPES.TRASHED,
                deletedDate: isCurrentlyTrashed ? null : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            };
        }
        return item;
    });
};

// Helper function to get icon component based on DATA_TYPE
export const getFileTypeIcon = (type) => {
    // This will be used in components to determine which icon to show
    // Returns a string identifier that components can use
    switch (type) {
        case DATA_TYPES.FOLDER:
            return 'folder';
        case DATA_TYPES.SHARED_FOLDER:
            return 'shared-folder';
        case DATA_TYPES.IMPORTED_FOLDER:
            return 'imported-folder';
        case DATA_TYPES.SYNCED_FOLDER:
            return 'synced-folder';
        case DATA_TYPES.PDF:
            return 'pdf';
        case DATA_TYPES.IMAGE:
            return 'image';
        case DATA_TYPES.SPREADSHEET:
            return 'spreadsheet';
        case DATA_TYPES.DOCUMENT:
            return 'document';
        case DATA_TYPES.PRESENTATION:
            return 'presentation';
        case DATA_TYPES.VIDEO:
            return 'video';
        case DATA_TYPES.AUDIO:
            return 'audio';
        case DATA_TYPES.CODE:
            return 'code';
        case DATA_TYPES.NOTEBOOK:
            return 'notebook';
        case DATA_TYPES.ARCHIVE:
            return 'archive';
        default:
            return 'other';
    }
};