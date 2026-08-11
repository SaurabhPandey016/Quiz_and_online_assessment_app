
export interface User {
    id: string, 
    name : string, 
    email : string, 
    role : "ADMIN" | "USER", 
    status : string, 
    createdAt: string, 
    updatedAt: string, 
}

export interface ApiResponse<T> {
    status : 'success' | 'fail' | 'error';
    message? : string, 
    results? : number, 
    meta?: {
        totalResults : number, 
        currentPage: number, 
        totalPages : number, 
        resultsPerPage: number, 
    };
    data?: T;
};

export interface AuthResponseData {
    user : User;
}