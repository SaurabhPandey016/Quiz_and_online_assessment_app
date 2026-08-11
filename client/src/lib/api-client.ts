import axios from 'axios';

export const apiClient = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000/api/v1',
    timeout: 10000, // Terminates stalled requests at a strict 10-second threshold
    headers: {
        'Content-Type': 'application/json',
    }, 
    withCredentials: true, // MANDATORY: Intercepts and attaches HTTP-Only cookies to requests automatically
});

// Response Interceptor for Global Error Handling Translation
apiClient.interceptors.response.use(
    (response) => response, 
    (error) => {
        // Standardizes fallback error payload properties structure matching your AppError backend design
        const customError = {
            status : error.response?.data.status || 'error',
            message: error.response?.data?.message || 'An unexpected structural network failure occurred. Please verify your internet connection.',
            statusCode: error.response?.status || 500,
        };

        console.log('🌐 Axios Network Pipeline Catch:', customError);
        return Promise.reject(customError);
    }
);
