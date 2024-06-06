import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from "react-native-push-notification";

// Configure push notifications
PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // Required on iOS only (see https://github.com/zo0r/react-native-push-notification#ios-notifications)
  },

  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // Process the action
  },
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

// Create notification channel
PushNotification.createChannel(
  {
    channelId: "fcm_fallback_notification_channel", // Same as specified in your notification payload
    channelName: "Default Channel",
    channelDescription: "A channel to categorise your notifications",
    soundName: "default",
    importance: 4, // Importance for the channel
    vibrate: true, // Enable vibration for notifications
  },
  (created) => console.log(`createChannel returned '${created}'`) // Callback function
);

AppRegistry.registerComponent(appName, () => App);
