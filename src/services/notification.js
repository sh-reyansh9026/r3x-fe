import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setupFCM = async (userId) => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) return;

  const fcmToken = await messaging().getToken();
  console.log("FCM Token:", fcmToken);

  // Save FCM token to backend
  await axios.put(`http://<YOUR_BACKEND_IP>:5000/api/users/${userId}/fcm-token`, { fcmToken });
};

export const onMessageListener = () =>
  messaging().onMessage(async remoteMessage => {
    console.log("FCM foreground:", remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: 'default',
      },
    });
  });
