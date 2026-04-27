import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';

export const signIn = (email: string, password: string) => signInWithEmailAndPassword(getAuth(), email, password);

export const signUp = (email: string, password: string) => createUserWithEmailAndPassword(getAuth(), email, password);

export const signOut = () => firebaseSignOut(getAuth());
