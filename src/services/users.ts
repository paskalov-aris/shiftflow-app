import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { UserProfile } from '../stores/userStore';

type NewUserData = Omit<UserProfile, 'teamId'> & { teamId: null };

export const createUserProfile = async (uid: string, data: NewUserData): Promise<void> => {
  await setDoc(doc(getFirestore(), 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(getFirestore(), 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
};
