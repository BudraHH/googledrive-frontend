import API from './api';

const authService = {
    register: async (userData) => {
        const response = await API.post('/user/register', userData);
        return response.data;
    },

    login: async (userData) => {
        const response = await API.post('/user/auth', userData);
        return response.data;
    },

    logout: async () => {
        const response = await API.post('/user/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await API.get('/user/profile');
        return response.data;
    },

    activate: async (token) => {
        const response = await API.get(`/user/activate/${token}`);
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await API.post('/user/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, password) => {
        const response = await API.put(`/user/reset-password/${token}`, { password });
        return response.data;
    }
};


export default authService;
