import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut } from '@react-native-firebase/auth';

export const signIn = (email: string, password: string) => {
  try {
    signInWithEmailAndPassword(getAuth(), email, password);
  } catch (error) {
    console.error(error);
  }
};

export const signOut = () => {
  try {
    firebaseSignOut(getAuth());
  } catch (error) {
    console.error(error);
  }
};
