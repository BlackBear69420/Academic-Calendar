import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}



export const sendMessageEvent = async (data) => {
  const fcmEndpoint = 'https://fcm.googleapis.com/v1/projects/calenderapp-b6878/messages:send';
  let concatenatedString = `${data.stream}${data.dept}${data.sem}`;
  let result = concatenatedString.replace(/\s+/g, '');
  console.log(result)
  console.log(data)

  console.log(data.title)
  console.log(data.description);

  const resToken = await axios.get('https://servercalendar.onrender.com/getToken');
  console.log(resToken.data.token);

  const bearerToken = resToken.data.token;


  const message = {
    message: {
      notification: {
        title: data.title,
        body: data.description
      },
      topic: result
    }
  };



  try {
    const response = await axios.post(fcmEndpoint, message, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}` // Use bearer token for authorization
      }
    });
    console.log('Successfully sent message:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

