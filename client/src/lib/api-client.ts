import axios from 'axios';

export const apiClient = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const customError = {
            status : error.response?.data.status || 'error',
            message: error.response?.data?.message || 'An unexpected structural network failure occurred. Please verify your internet connection.',
            statusCode: error.response?.status || 500,
        };

        console.log('🌐 Axios Network Pipeline Catch:', customError);
        return Promise.reject(customError);
    }
);
