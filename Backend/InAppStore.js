import AsyncStorage from '@react-native-async-storage/async-storage';

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
<<<<<<< HEAD
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
=======
      await AsyncStorage.setItem('userDept', data.department);
      await AsyncStorage.setItem('userSem', data.sem);
      await AsyncStorage.setItem('userStream', data.stream);
      await AsyncStorage.setItem('userEmail', data.email);
      await AsyncStorage.setItem('userUsn', data.usn);
      await AsyncStorage.setItem('userData', JSON.stringify(data));
>>>>>>> 54bc770371c6505b2ab309dcfc656bf983ce7d0f
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
  