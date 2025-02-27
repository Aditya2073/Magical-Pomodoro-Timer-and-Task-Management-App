import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Task } from '../types';

interface UserData {
  tasks: Task[];
  completedSessions: number;
  settings: {
    isMuted: boolean;
    showMascot: boolean;
  };
}

export const saveUserData = async (userId: string, data: Partial<UserData>) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, data, { merge: true });
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() as UserData : null;
};

export const updateUserTasks = async (userId: string, tasks: Task[]) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { tasks });
};

export const updateUserSessions = async (userId: string, completedSessions: number) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { completedSessions });
}; 