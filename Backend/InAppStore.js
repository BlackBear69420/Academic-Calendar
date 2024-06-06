import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging'

export const saveRole = async (role, data) => {
  try {
    if (role === 'admin') {
      // Save specific values for the admin role
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userDept', 'N/A');
      await AsyncStorage.setItem('userSem', 'N/A');
      await AsyncStorage.setItem('userStream', 'N/A');
      await AsyncStorage.setItem('userEmail', 'adminlogin@gmail.com');
      await AsyncStorage.setItem('userUsn', 'N/A');
      await AsyncStorage.setItem('userData', JSON.stringify({
        email: 'adminlogin@gmail.com',
        password: 'admin123',
        role: 'admin',
      }));
    } else {
      // Save the given data for other roles
      await AsyncStorage.setItem('userRole', role);
      console.log(data);
      if(role != 'admin')
      {
        await AsyncStorage.setItem('userDept', data.department);
        await AsyncStorage.setItem('userSem', data.sem);
        await AsyncStorage.setItem('userStream', data.stream);
        await AsyncStorage.setItem('userEmail', data.email);
        await AsyncStorage.setItem('userUsn', data.usn);
      }
      console.log('Role saved successfully');
    }

    console.log('Role saved successfully');
  } catch (error) {
    console.error('Failed to save the role to Async Storage', error);
  }
};


export const getRole = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      if (role !== null) {
        console.log('Role retrieved successfully', role);
        return role;
      }
    } catch (error) {
      console.error('Failed to retrieve the role from Async Storage', error);
    }
    return null;
};

export const getUserdata = async () => {
  try {
    const dept=  await AsyncStorage.getItem('userDept');
    const sem=  await AsyncStorage.getItem('userSem');
    const stream=  await AsyncStorage.getItem('userStream');
    const email=  await AsyncStorage.getItem('userEmail');
    const usn=  await AsyncStorage.getItem('userUsn');
    const data = {
      dept,
      sem,
      stream,
      email,
      usn
    }
    if (data !== null) {
      console.log('data retrieved successfully', data);
      return data;
    }
  } catch (error) {
    console.error('Failed to retrieve the data from Async Storage', error);
  }
  return null;
};

export const logout = async () => {
  try {
    const role = await getRole();
    if (role != 'admin') {
        const user = await getUserdata();
        if (user.stream && user.dept && user.sem) 
        {
          const topic = `${user.stream}${user.dept}${user.sem}`.replace(/\s+/g, '');

          console.log("Unsubscribing from topic:", topic);

          messaging().unsubscribeFromTopic(topic)
            .then(() => console.log(`Unsubscribed from topic: ${topic}`))
            .catch(error => console.error('Error unsubscribing from topic:', error));
        }
    }

      await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userDept');
    await AsyncStorage.removeItem('userSem');
    await AsyncStorage.removeItem('userStream');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userUsn');
    await AsyncStorage.removeItem('userData');
    console.log('All user data removed successfully');
  } catch (error) {
    console.error('Failed to remove the data from Async Storage', error);
  }
};
  