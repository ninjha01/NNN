importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAXFzX3wRZaePnUEaUywU4RfyeOmBylgCU",
  authDomain: "abacus-306700.firebaseapp.com",
  projectId: "abacus-306700",
  storageBucket: "abacus-306700.appspot.com",
  messagingSenderId: "817393858499",
  appId: "1:817393858499:web:01101dc9616b0bb78c2f76",
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo512.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
