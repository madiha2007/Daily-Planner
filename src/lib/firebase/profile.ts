import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { User } from 'firebase/auth';
import { db, storage } from './config';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: unknown;
}

// Called once, right after signup — creates the Firestore mirror doc
// and sets displayName on the Auth user so it's available instantly
// via `user.displayName` anywhere in the app, no extra fetch needed.
export async function createUserProfile(user: User, name: string) {
  await updateProfile(user, { displayName: name });
  await setDoc(doc(db, 'users', user.uid), {
    name,
    email: user.email,
    avatarUrl: null,
    createdAt: serverTimestamp(),
  });
}

export async function updateUserName(user: User, name: string) {
  await updateProfile(user, { displayName: name });
  await updateDoc(doc(db, 'users', user.uid), { name });
}

// Uploads an avatar image, updates Storage, Auth photoURL, and the
// Firestore mirror doc — returns the final download URL.
export async function uploadAvatar(user: User, file: File): Promise<string> {
  const avatarRef = ref(storage, `users/${user.uid}/avatar/${file.name}`);
  await uploadBytes(avatarRef, file);
  const url = await getDownloadURL(avatarRef);
  await updateProfile(user, { photoURL: url });
  await updateDoc(doc(db, 'users', user.uid), { avatarUrl: url });
  return url;
}