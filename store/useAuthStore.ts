import { create } from 'zustand';


interface User {
    id: string;
    email: string;
    name?: string;
    cover: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    clearAuth: () => set({ user: null, token: null }),
}));

export default useAuthStore;