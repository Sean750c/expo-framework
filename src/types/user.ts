import type { ApiResponse } from './api';

// Global Types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin' | 'vip';
    createdAt: Date;
    updatedAt: Date;
}