import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveRole = async (role, data) => {
    try {
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
  