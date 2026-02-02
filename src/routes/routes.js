export const ROUTES = {
    PUBLIC: {
        HOME: '/',
        LOGIN: '/login',
        SIGNUP: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        // Typically reset password has a token param, e.g. /reset-password/:token
        RESET_PASSWORD: '/reset-password/:token',
        VERIFY_EMAIL: '/verify-email',
        UNAUTHORIZED: '/unauthorized',
        NOT_FOUND: '/not-found',
    },
    PROTECTED: {
        ADMIN: {
            DASHBOARD: '/admin/dashboard',
        },
        USER: {
            DASHBOARD: '/drive/home',
            WELCOME: '/welcome',
            MY_DRIVE: '/drive/my-drive',
            COMPUTERS: '/drive/computers',
            SHARED: '/drive/shared-with-me',
            RECENT: '/drive/recent',
            STARRED: '/drive/starred',
            SPAM: '/drive/spam',
            BIN: '/drive/trash',
            STORAGE: '/drive/storage',
            FOLDER: '/drive/folders/:folderId',
            FILE_PREVIEW: '/file/d/:fileId/view',
        },
    },
};
