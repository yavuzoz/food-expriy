import Navigation from './src/components/Navigation';
import React, { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { sendPushNotification, registerForPushNotificationsAsync, checkExpiredProducts } from './src/api';


export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  let notificationTriggeredToday = false
  Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
  }); 
  const sendNotification = async () => {
    if(notificationTriggeredToday === false) {
      const fetchExpiredProducts = await checkExpiredProducts();
      if (fetchExpiredProducts) {
        await sendPushNotification(expoPushToken);
        
      }
    }
    notificationTriggeredToday = true;
    
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      
    });

    const interval = setInterval(() => {
      notificationTriggeredToday = false;
      sendNotification();
      
    }, 24 * 60 * 60 * 1000);
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      clearInterval(interval);
    };
  }, [expoPushToken]);


  return (
    <Navigation/>
  );
}


