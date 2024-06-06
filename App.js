import React, { useContext, useEffect, useState } from 'react';
import { useColorScheme, View , Alert} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { UserContext, UserProvider } from './UserContext';
import AuthNavigation from './Navigation/AuthNavigation';
import StudentNav from './Navigation/StudentNav';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import AdminNav from './Navigation/AdminNav';
import { getRole, getUserdata } from './Backend/InAppStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper'; 
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from './Backend/Notification';
import PushNotification from 'react-native-push-notification';

function AppWrapper() {
  const isDarkMode = useColorScheme() === 'dark';
  const { userId,setUserId } = useContext(UserContext);
  const [role, setRole] = useState(null);


  useEffect(() => {
    requestUserPermission();
    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
         console.log(fcmToken);
      } 
     }

     
     checkToken();


     return messaging().onTokenRefresh(token => {
      console.log('Device FCM Token refreshed: ', token);
    });
  }, []);

  useEffect(()=>{
    messaging().onMessage(async remoteMessage => {
      console.log("Message REcived");
      console.log("Foreground notification:", remoteMessage);
      PushNotification.localNotification({
        channelId: 'fcm_fallback_notification_channel',
        title: remoteMessage.notification.title || 'Notification Title',
        message: remoteMessage.notification.body || 'Notification Body',
      });
    });

    if(userId && role!='admin')
    {
      const fetchData = async () => {
        const user = await getUserdata();
        console.log('data', user);
        if(user.stream && user.dept &&user.sem)
          {
            console.log("Indeis subscribe");
            let concatenatedString = `${user.stream}${user.dept}${user.sem}`;
            let result = concatenatedString.replace(/\s+/g, '');
            console.log(`Befire Subscribed to topic!${result}`)
            messaging()
            .subscribeToTopic(`${result}`)
            .then(() => console.log(`Subscribed to topic!${result}`));
          }
      };
      fetchData();
    }
    
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  },[role, userId]);

  const fetchRole = async()=>{
    if(userId){
      const r = await getRole();
      setRole(r);
    }
  }
  useEffect(()=>{
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userEmail');
      if (id) {
        setUserId(id);
      }
    };
    fetchUserId();
  },[])


  useEffect(()=>{
    fetchRole();
  },[userId]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <PaperProvider>
          <View style={backgroundStyle}>
      {userId && role ? (role=== 'admin'?<AdminNav/>: <StudentNav />) : <AuthNavigation />}
    </View>
    </PaperProvider>

  );
}

const App = () => {
  return (
    <UserProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppWrapper />
      </ApplicationProvider>
    </UserProvider>
  );
};

export default App;
