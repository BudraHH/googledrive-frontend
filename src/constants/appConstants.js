export const MUTATION_TYPES = {
    NOTHING: 0,
    STARRED: 1,
    TRASHED: 2,
    SPAM: 3,
};

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
};

// Default filter configuration
export const defaultFilterConfig = {
    type: null,
    people: null,
    modified: null,
    source: null
};
