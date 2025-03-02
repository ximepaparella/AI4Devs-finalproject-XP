import axios from 'axios';
import { getSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the session
      const session = await getSession();
      
      // Log session for debugging
      console.log('Current session:', session);
      
      // If there's a session with an access token, add it to the request
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
        console.log('Adding token to request:', session.accessToken);
      } else {
        console.log('No access token found in session');
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log errors for debugging
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    });

    const originalRequest = error.config;
    
    // If the error is a 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Get current session
      const session = await getSession();
      
      if (!session) {
        // Redirect to login page if no session
        console.log('No session found, redirecting to login');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      // Try the request again with the current session
      try {
        const response = await axios({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${session.accessToken}`
          }
        });
        return response;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        window.location.href = '/login';
        return Promise.reject(retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 