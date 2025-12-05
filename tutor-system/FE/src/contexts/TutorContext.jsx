import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMyTutorProfile } from '../services/tutorService';

const TutorContext = createContext(null);

export function TutorProvider({ children }) {
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTutorProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Loading tutor profile...');
      const profile = await getMyTutorProfile();
      setTutorProfile(profile);
      console.log('✅ Tutor profile loaded:', profile?.userId?.fullName || 'Unknown');
    } catch (err) {
      console.error('❌ Error loading tutor profile:', err);
      setError(err);
      // Don't set null - keep existing profile or it will be null
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTutorProfile();
  }, [loadTutorProfile]);

  const value = {
    tutorProfile,
    loading,
    error,
    reload: loadTutorProfile,
  };

  return (
    <TutorContext.Provider value={value}>
      {children}
    </TutorContext.Provider>
  );
}

export function useTutorProfile() {
  const context = useContext(TutorContext);
  if (context === undefined) {
    throw new Error('useTutorProfile must be used within TutorProvider');
  }
  return context;
}
