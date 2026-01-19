// store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthData {
  token: string;
  fullname: string;
  username: string;
  auth: string;
  userid: string
}

interface AuthState {
  user: AuthData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (authData: AuthData) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (authData) => {
        set({
          user: authData,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);