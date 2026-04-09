import { create } from "zustand";
import { apiClient, API_ENDPOINTS } from "../services/apiClient";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: true, // start with loading true
  isAuthenticated: false,
  error: null,

  // LOGIN
  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;

    try {
      set({ loading: true, error: null });

      const res = await apiClient.post(API_ENDPOINTS.LOGIN, userCredObj);

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      set({ loading: true, error: null });

      await apiClient.get(API_ENDPOINTS.LOGOUT);

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },

  // CHECK AUTH WHEN APP STARTS
  checkAuth: async () => {
    try {
      set({ loading: true });

      const res = await apiClient.get(API_ENDPOINTS.CHECK_AUTH);

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });

    } catch (err) {

      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      console.error("Auth check failed:", err);

      set({ loading: false });
    }
  },
}));