// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import {
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-lnxw8dcM_PL_pQlDUCMei8ETlJfFytg",
  authDomain: "notification-enabler.firebaseapp.com",
  projectId: "notification-enabler",
  storageBucket: "notification-enabler.appspot.com",
  messagingSenderId: "346986908646",
  appId: "1:346986908646:web:b98b134ce8a8fdbae7a427",
};
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();
const messaging = getMessaging();
const auth = getAuth();

export const initializeMessaging = async () => {
  getNotificationSources();
};

interface NotificationSource {}

const getNotificationSources = async (): Promise<NotificationSource[]> => {
  const sources: NotificationSource[] = [];
  const querySnapshot = await getDocs(collection(db, "topics"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
  return sources;
};

export const setUserObserver = (observer: (user: User | null) => void) => {
  onAuthStateChanged(auth, observer);
};

export const signUp = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    var user = userCredential.user;
    return user.uid;
  } catch (err) {
    alert(err.message);
    return null;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    var user = userCredential.user;
    return user.uid;
  } catch (err) {
    alert(err.message);
    return null;
  }
};
