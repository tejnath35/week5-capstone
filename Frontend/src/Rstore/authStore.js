import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "https://week5-capstone.onrender.com");

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

      const res = await axios.post(`${API_URL}/common-api/login`, userCredObj, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

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

      await axios.get(`${API_URL}/common-api/logout`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });

      localStorage.removeItem("token");

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

      const res = await axios.get(`${API_URL}/common-api/check-auth`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });

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