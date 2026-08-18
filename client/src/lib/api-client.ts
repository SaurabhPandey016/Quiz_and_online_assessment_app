import axios from 'axios';

export const apiClient = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api/v1',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'An error occurred. Please try again.';
        let statusCode = 500;

        if (error.response) {
            statusCode = error.response.status;
            message = error.response?.data?.message || `Server error (${statusCode})`;

            if (statusCode === 403) {
                message = 'Access denied. Please check your credentials.';
            } else if (statusCode === 401) {
                message = 'Unauthorized. Please sign in again.';
            } else if (statusCode === 404) {
                message = 'Resource not found.';
            } else if (statusCode === 429) {
                message = 'Too many requests. Please try again later.';
            }
        } else if (error.request) {
            statusCode = 0;
            message = 'Cannot connect to the server. Check your internet connection.';
        } else {
            message = error.message || 'An error occurred.';
        }

        return Promise.reject({
            status: error.response?.data?.status || 'error',
            message,
            statusCode,
        });
    }
);

export const checkApiHealth = async (): Promise<boolean> => {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api/v1';
        const response = await axios.get(`${baseURL}/health`, {
            timeout: 8000,
            withCredentials: true,
        });
        return response.status === 200;
    } catch {
        return false;
    }
};
