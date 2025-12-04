import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

/**
 * AuthCallback: Handles CAS ticket validation for Admin Client
 * 
 * CAS Flow (Step 5-7):
 * 1. User is redirected here from CAS server with ?ticket=ST-xxxxx
 * 2. Extract ticket from URL query params
 * 3. Send ticket to CAS server for validation (server-to-server call)
 * 4. If valid, server returns user info
 * 5. Save user to AuthContext
 * 6. Redirect to /dashboard
 */
function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateTicket = async () => {
      const ticket = searchParams.get('ticket');
      
      // No ticket in URL - invalid callback
      if (!ticket) {
        console.error('No ticket found in callback URL');
        navigate('/', { replace: true });
        return;
      }

      try {
        // Service URL must match what was sent to CAS during login redirect (ADMIN PORT)
        const serviceUrl = 'http://localhost:3001/auth/callback';
        
        // Validate ticket with CAS server
        const response = await api.post('/auth/validate', {
          ticket,
          service: serviceUrl,
        });

        if (response.data.success && response.data.user) {
          // Ticket is valid - save user to context
          console.log('✅ Admin Client: Ticket validated successfully');
          login(response.data.user);
          // Redirect to admin dashboard immediately
          navigate('/dashboard', { replace: true });
        } else {
          // Invalid ticket
          setIsValidating(false);
          setError('Authentication failed: Invalid ticket');
          setTimeout(() => navigate('/', { replace: true }), 2000);
        }
      } catch (err) {
        console.error('Ticket validation error:', err);
        setIsValidating(false);
        setError('Authentication failed: ' + (err.response?.data?.message || err.message));
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    };

    validateTicket();
  }, [searchParams, navigate, login]);

  if (error && !isValidating) {
    return (
      <div className="container">
        <div className="card">
          <h1>Authentication Error</h1>
          <p style={{ color: 'red' }}>{error}</p>
          <p>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card loading" style={{background: 'white', color: '#666'}}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0066cc',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite',
        }} />
        <h2>Authenticating Admin Client...</h2>
        <p>Validating your ticket with CAS server...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AuthCallback;
