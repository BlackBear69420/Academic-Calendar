import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
const bearerToken = 'ya29.c.c0AY_VpZg5993RgcLTj8br4E20VLz62wPEWCNJEW9UVGbo0B_pxNB5JaIb4JuGBWdS_yOXu6kkrYTO1rOUKhpG9eEjoX9j77yo_r7kCZrpVycs5ulUDeAGr2lk4MKcvCXcBXr337Urf98nX-Ud8ZpvJGxfcn-33j6RvV1QLZswl-JzyIO-EA49Y5pkqYbjWk5AlfA4gEV5Ih9fBLpjtYJLrWJBxU6UrHkX2MH9rTlaSR1DWoqmMR7OdNgY5_WVW5rhmoxA3uUNGaIQT7zKwPVUJdUkgQM07Yilhn2RjNmnKBt9Aybe9O1yz4D6wAkHMvJBAQ41yPXbVyGRvU0auwWy6PuJmGXmeOauvP8R7hl8cC_TCFPXyMOnnMa0N385Dz3j-VBgI-SFpqZukwXfgtfsZraY46FVeVI25yyfYIu4Zx0aR1ZqqhOraml6i8X9OqF1SfOn-u5agl3XZWOIJIbkumsS3sbBpqz_hip11Ql_YsidSRU0Mozlqv1Re272c0em42i9IXXlWf195FzkjRa6-We3jWWRpvnfn08yjRkB3e4aYz3g_dhOVwxxVwq-bZs-Wez692lViigdZ4zljxd2w-iVjWluWXcZhvjzOWnhS3l-mgIht__6YyeYnqznltzv20YRIji6swv2tYscn4IY8u4X_271o-w64yY_4QraU5WJia-p8IXY3_bv4Xufcsc1Z04jBMhs_5-p7njdg3ahkl3Olp8rbxM-ZO974lyhVbwu1vQi9xROWSFavk5yw2mJmR3RS5YlR20Z_7VwdMkYtZyVWa0Vu9MltVkB4efWudzdYzXgOotZWg3xBgXFp728JgpJWQ9W_7npcXUh3ROi6Xj_Js2l4ibu_8MYt_ay5-h4b697abwRz4u16j43SyOU5grroVBSl17v67B2iqvq2tr97F8FUm7uOVkkmZil1-Qr4QZYX5eQY2aB1ato1_Mwnu04blq_WJFR5rkp7bfyY3WsbM5BIpnlnc3-MIwYoJzMqufk-kvIIZJ';


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
  console.log(data.description)


  const message = {
    message:{
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

