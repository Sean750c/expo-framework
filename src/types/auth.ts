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

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AppState {
    theme: 'light' | 'dark';
    isOnline: boolean;
    appState: 'active' | 'background' | 'inactive';
}