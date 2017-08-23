/*Fire base messaging service worker starts */
importScripts("https://www.gstatic.com/firebasejs/4.0.0/firebase-app.js");
importScripts('https://www.gstatic.com/firebasejs/4.0.0/firebase-messaging.js');
importScripts('./js/sw-offline-google-analytics.js');

//Initialize the Offline Google analytics
goog.offlineGoogleAnalytics.initialize();

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '209914723434'
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    title: payload.notification.title,
    body: payload.notification.body,
    icon: payload.notification.icon,
    click_action : payload.notification.click_action
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
});