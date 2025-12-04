/**
 * Authentication utility functions
 */

import { fetchCurrentUser } from '../api/studentApi';

/**
 * Redirect user based on their role
 * @param {Function} navigate - React Router navigate function
 * @param {Object} userData - User data object containing role
 */
export const redirectByRole = (navigate, userData) => {
  const userRole = userData?.data?.role || userData?.role;
  
  switch (userRole?.toLowerCase()) {
    case 'tutor':
      navigate("/tutor/dashboard");
      break;
    case 'pdt':
      navigate("/pdt/homepage");
      break;
    case 'student':
    default:
      navigate("/student/dashboard");
      break;
  }
};

/**
 * Handle authentication callback with token
 * Fetches user data and redirects based on role
 * @param {string} token - JWT token from authentication
 * @param {Function} navigate - React Router navigate function
 */
export const handleAuthCallback = async (token, navigate) => {
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    localStorage.setItem("bkarch_jwt", token);
    
    // Fetch user data to determine role
    const userData = await fetchCurrentUser();
    
    // Redirect based on role
    redirectByRole(navigate, userData);
  } catch (error) {
    console.error("Error during auth callback:", error);
    // Fallback to student dashboard on error
    navigate("/student/dashboard");
  }
};

/**
 * Get current user role from localStorage or API
 * @returns {Promise<string|null>} User role or null if not authenticated
 */
export const getUserRole = async () => {
  const token = localStorage.getItem("bkarch_jwt");
  if (!token) return null;

  try {
    const userData = await fetchCurrentUser();
    return userData?.data?.role || userData?.role || 'student';
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("bkarch_jwt");
};

/**
 * Logout user
 * @param {Function} navigate - React Router navigate function
 */
export const logout = (navigate) => {
  localStorage.removeItem("bkarch_jwt");
  navigate("/login");
};
