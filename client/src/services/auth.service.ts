import { apiClient } from '@/lib/api-client';
import { ApiResponse, AuthResponseData } from '@/types/api.types';

export class AuthService {
    static async login(payload : Record<string, string>): Promise<ApiResponse<AuthResponseData>> {
        const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
        return response.data;
    }

    static async logout(): Promise<ApiResponse<{message: string}>>{
        const response = await apiClient.post<ApiResponse<{message: string} >>('/auth/logout');
        return response.data;
    }
}
