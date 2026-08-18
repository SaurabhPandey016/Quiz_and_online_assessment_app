import axios from 'axios';

const RENDER_API_URL = 'https://quiz-and-online-assessment-app.onrender.com/api/v1';
const LOCAL_API_URL = 'http://localhost:10000/api/v1';

const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
            return LOCAL_API_URL;
        }
    }

    return process.env.NEXT_PUBLIC_API_URL || RENDER_API_URL;
};

export const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
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
        const response = await axios.get(`${getApiBaseUrl()}/health`, {
            timeout: 8000,
            withCredentials: true,
        });
        return response.status === 200;
    } catch {
        return false;
    }
};
