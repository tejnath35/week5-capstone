import axios from "axios";

// Get API base URL from environment or use default
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Automatically use localhost in dev, and Render in production
  return import.meta.env.DEV ? "http://localhost:4000" : "https://week5-capstone.onrender.com";
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Add a request interceptor to attach token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export API_BASE_URL for components that need it
export { API_BASE_URL };

// API endpoints
export const API_ENDPOINTS = {
  // Auth APIs
  LOGIN: "/common-api/login",
  LOGOUT: "/common-api/logout",
  CHECK_AUTH: "/common-api/check-auth",
  FORGOT_PASSWORD: "/common-api/forgot-password",
  CHANGE_PASSWORD: "/common-api/change-password",

  // User APIs
  REGISTER_USER: "/user-api/users",
  GET_USER_PROFILE: "/user-api/profile",
  GET_ALL_ARTICLES: "/user-api/articles",
  GET_ARTICLE_BY_ID: (id) => `/user-api/article/${id}`,
  ADD_COMMENT: (articleId) => `/user-api/articles/${articleId}/comments`,

  // Author APIs
  REGISTER_AUTHOR: "/author-api/users",
  GET_AUTHOR_ARTICLES: (userId) => `/author-api/articles/${userId}`,
  CREATE_ARTICLE: "/author-api/articles",
  UPDATE_ARTICLE_STATUS: (articleId) => `/author-api/articles/${articleId}/status`,
  UPDATE_ARTICLE: (articleId) => `/author-api/articles/${articleId}`,

  // Admin APIs
  DELETE_USER: (userId) => `/admin-api/users/${userId}`,
};
