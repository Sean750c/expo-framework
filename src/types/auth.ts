// Global Types


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