import axios from 'axios';
import { getSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Get the session
    const session = await getSession();
    
    // If there's a session with an access token, add it to the request
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is a 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api; 