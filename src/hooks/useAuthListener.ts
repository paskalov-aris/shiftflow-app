import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

export const useAuthListener = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      console.log('user', user);
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);
};
