// API utility for making HTTP requests to the backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...restOptions } = options;

  const token = getAuthToken();
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...headers,
    },
    ...restOptions,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, create a basic error response
      data = {
        success: false,
        message: response.statusText || 'Invalid response from server'
      };
    }

    if (!response.ok) {
      throw new APIError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
}

// Exported API methods
export const api = {
  get: (endpoint, options) => fetchAPI(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => fetchAPI(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => fetchAPI(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => fetchAPI(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => fetchAPI(endpoint, { ...options, method: 'DELETE' }),
};

export { APIError, API_BASE_URL };
