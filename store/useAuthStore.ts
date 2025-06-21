import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string;
  cover: string;
  onboardingComplete: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

const getSavedToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getSavedUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isInitialized: false,
  isLoading: false,

  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  setToken: (token) => {
    set({ token });
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  clearAuth: () => {
    set({ user: null, token: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },

  // Initialize auth state from localStorage with loading state
  initializeAuth: async () => {
    // Don't initialize if already done
    if (get().isInitialized) return;

    set({ isLoading: true });

    try {
      const savedToken = getSavedToken();
      const savedUser = getSavedUser();

      set({
        token: savedToken,
        user: savedUser,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({
        isInitialized: true,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
