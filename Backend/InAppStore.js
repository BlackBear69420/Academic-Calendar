import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveRole = async (role) => {
    try {
      await AsyncStorage.setItem('userRole', role);
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
  