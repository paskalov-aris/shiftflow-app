import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { getUserProfile } from '../services/users';

export const useAuthListener = () => {
  const { setUser, setLoading } = useAuthStore();
  const { setProfile, setLoading: setUserLoading } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async user => {
      setUser(user);
      if (user) {
        setUserLoading(true);
        try {
          const profile = await getUserProfile(user.uid);
          setProfile(profile);
        } finally {
          setUserLoading(false);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading, setProfile, setUserLoading]);
};
