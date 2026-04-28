import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from '@react-native-firebase/auth';

export const signIn = (email: string, password: string) => signInWithEmailAndPassword(getAuth(), email, password);

export const signUp = (email: string, password: string) => createUserWithEmailAndPassword(getAuth(), email, password);

export const signOut = () => firebaseSignOut(getAuth());

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = getAuth().currentUser;
  if (!user || !user.email) throw new Error('No authenticated user');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
