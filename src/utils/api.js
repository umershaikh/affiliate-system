/**
 * API fetch wrapper that auto-attaches the JWT Authorization header
 * and handles 401 responses globally.
 */

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...(options.headers || {}),
  };

  // Only set Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Prepend the base URL from the environment if present
  const baseURL = process.env.REACT_APP_API_URL || '';
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // If 401 → token expired or invalid → redirect to login
  if (response.status === 401 && !url.includes('/api/login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return Promise.reject(new Error('Session expired'));
  }

  return response;
};

export default apiFetch;
