import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute: Guards routes that require authentication
 * 
 * CAS Flow:
 * 1. Check if user is loading (initial session check)
 * 2. If no user is authenticated, redirect browser to CAS server
 * 3. CAS server will handle login and redirect back to /auth/callback with a ticket
 * 4. If user is authenticated, render the protected route
 */
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // Still checking session from cookie
  if (isLoading) {
    return (
      <div className="container">
        <div className="card loading">Loading...</div>
      </div>
    );
  }

  // User not authenticated -> redirect to CAS server
  if (!user) {
    // Service URL: where CAS will redirect back to after login (ADMIN CLIENT PORT)
    const serviceUrl = 'http://localhost:3001/auth/callback';
    
    // Build CAS login URL with service parameter
    const casLoginUrl = `http://localhost:5001/auth/login?service=${encodeURIComponent(serviceUrl)}`;
    
    // Redirect browser to CAS server (full page redirect)
    window.location.href = casLoginUrl;
    
    // Show loading while redirecting
    return (
      <div className="container">
        <div className="card loading" style={{background: 'white', color: '#666'}}>
          Redirecting to CAS login...
        </div>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <Outlet />;
};

export default ProtectedRoute;
