import API from '../api';

export const filesAPI = {
    // Fetch all files and folders (optional parentFolderId)
    getItems: async (parentFolderId = null, isTrashed = false) => {
        let query = parentFolderId ? `?parentFolderId=${parentFolderId}` : '';
        if (isTrashed) {
            query += query ? '&trash=true' : '?trash=true';
        }
        const response = await API.get(`/files${query}`);
        return response.data;
    },

    // Fetch recent files
    getRecentItems: async () => {
        const response = await API.get('/files/recent');
        return response.data;
    },

    // Fetch starred items
    getStarredItems: async () => {
        const response = await API.get('/files/starred');
        return response.data;
    },

    // Fetch trashed items
    getTrashedItems: async () => {
        const response = await API.get('/files/trash');
        return response.data;
    },

    // Get single item by ID
    getItem: async (id) => {
        const response = await API.get(`/files/${id}`);
        return response.data;
    },

    // Create a new folder
    createFolder: async (name, parentFolderId = null) => {
        const response = await API.post('/files/metadata', {
            name,
            type: 'folder',
            parentFolderId
        });
        return response.data.item;
    },

    // Rename a file or folder
    rename: async (id, name) => {
        const response = await API.put(`/files/${id}/rename`, { name });
        return response.data;
    },

    // Move item to bin (soft delete)
    trash: async (id) => {
        const response = await API.put(`/files/${id}/trash`);
        return response.data;
    },

    // Restore item from bin
    restore: async (id) => {
        const response = await API.put(`/files/${id}/restore`);
        return response.data;
    },

    // Toggle star status
    toggleStar: async (id) => {
        const response = await API.put(`/files/${id}/star`);
        return response.data;
    },

    // Permanently delete item
    deleteForever: async (id) => {
        const response = await API.delete(`/files/${id}`);
        return response.data;
    },

    // Get download URL for a file
    getDownloadUrl: async (id) => {
        const response = await API.get(`/files/${id}/download`);
        return response.data;
    }
};
