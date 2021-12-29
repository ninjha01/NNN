// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import {
  getMessaging,
  getToken,
  NotificationPayload,
  onMessage,
} from "firebase/messaging";
import { getFunctions, httpsCallable } from "firebase/functions";

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
initializeApp(firebaseConfig);

const db = getFirestore();
const messaging = getMessaging();
const auth = getAuth();
const functions = getFunctions();

const retrieveToken = async (): Promise<string> => {
  const token = await getToken(messaging, {
    vapidKey:
      "BJMBVQWFGM4pyN0KQWvqDgX8CNi7pT4HWpWZiQP_u8uXamHyxxPs_xY7xmYVufwLp7zqy2iKw4-vEuYFqB3ctaU",
  });
  return token;
};
const displayNotification = (title: string, body: string) => {
  if (Notification.permission == "granted") {
    navigator.serviceWorker.getRegistration().then(function (reg: any) {
      const options = {
        body: body,
        icon: "/logo512.png",
      };
      console.log("trying to show", title, options);
      reg.showNotification(title, options);
    });
  } else {
    alert(title);
  }
};

onMessage(messaging, (payload: any) => {
  console.log("Message received. ", payload);
  const notification = payload.notification;
  const title = notification.title;
  const body = notification.body;
  displayNotification(title, body);
});

export const initializeMessaging = async (
  currentUserId: string,
  queueMsg: (msg: string) => void
): Promise<NotificationSource[]> => {
  const token = await retrieveToken();
  console.log("token", token);
  console.log("currentUserId", currentUserId);
  const sources = await getNotificationSources(currentUserId);
  const subscribedNotificationSources = sources.filter((source) =>
    source.subscribers.includes(currentUserId)
  );
  const subscribedTopics = subscribedNotificationSources.map(
    (source) => source.id
  );
  const subResult = await subscribeTokenToTopics({
    token: token,
    topics: subscribedTopics,
  });
  const subMsg = `Successfully subscribed to ${subscribedTopics}: ${subResult.data.message}`;
  console.log(subMsg);
  queueMsg(subMsg);
  const unsubscribedNotificationSources = sources.filter(
    (source) => !source.subscribers.includes(currentUserId)
  );
  const unsubscribedTopics = unsubscribedNotificationSources.map(
    (source) => source.id
  );
  const { data } = await unsubscribeTokenToTopics({
    token: token,
    topics: unsubscribedTopics,
  });
  const unsubMsg = `Successfully unsubscribed to ${unsubscribedTopics}: ${data.message}`;
  console.log(unsubMsg);
  queueMsg(unsubMsg);
  return sources;
};

export const subscribeToTopic = async (
  topic: string,
  currentUserId: string
) => {
  const token = await retrieveToken();
  const { data } = await subscribeTokenToTopics({ token, topics: [topic] });
  const topicRef = doc(db, "topics", topic);

  await updateDoc(topicRef, {
    subscribers: arrayUnion(currentUserId),
  });
  return data.message === "Success";
};

export const unsubscribeFromTopic = async (
  topic: string,
  currentUserId: string
) => {
  const token = await retrieveToken();
  const { data } = await unsubscribeTokenToTopics({ token, topics: [topic] });
  const topicRef = doc(db, "topics", topic);

  await updateDoc(topicRef, {
    subscribers: arrayRemove(currentUserId),
  });

  return data.message === "Success";
};

const subscribeTokenToTopics: (data: {
  token: string;
  topics: string[];
}) => Promise<{ data: { message: string } }> = httpsCallable(
  functions,
  "subscribeTokenToTopics"
) as any;
const unsubscribeTokenToTopics: (data: {
  token: string;
  topics: string[];
}) => Promise<{ data: { message: string } }> = httpsCallable(
  functions,
  "unsubscribeTokenToTopics"
) as any;

export interface NotificationSource {
  id: string;
  display_name: string;
  subscribers: string[];
}

const getNotificationSources = async (
  currentUserId: string
): Promise<NotificationSource[]> => {
  const sources: NotificationSource[] = [];
  const querySnapshot = await getDocs(collection(db, "topics"));
  querySnapshot.forEach(async (doc) => {
    const data: any = await doc.data();
    if (data.allowed_user_ids.includes(currentUserId)) {
      sources.push({
        id: doc.id,
        display_name: data.display_name,
        subscribers: data.subscribers,
      });
    }
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
