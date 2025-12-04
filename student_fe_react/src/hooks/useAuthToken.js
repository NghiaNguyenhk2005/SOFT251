import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook to automatically capture and save auth token from URL
 * After CAS login, backend redirects to: /dashboard?token=xxx
 * This hook will:
 * 1. Check URL for token parameter
 * 2. Save token to localStorage
 * 3. Remove token from URL for security
 * 4. Trigger context reload
 */
export function useAuthToken(onTokenReceived) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      console.log('✅ Token received from URL, saving to localStorage...');
      
      // Save token to localStorage
      localStorage.setItem('bkarch_jwt', token);
      
      // Remove token from URL for security
      searchParams.delete('token');
      setSearchParams(searchParams, { replace: true });
      
      // Notify parent component that token was received
      if (onTokenReceived) {
        onTokenReceived(token);
      }
      
      console.log('✅ Token saved successfully');
    }
  }, [searchParams, setSearchParams, onTokenReceived]);
}
