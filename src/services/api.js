import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Handling global errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Automatically clear local state if token expires
            // Note: We can't import useAuthStore here directly due to circular dependencies
            // but the next page refresh will trigger a logout because checkAuth will fail
            console.error('Session expired');
        }
        return Promise.reject(error);
    }
);

export default API;

