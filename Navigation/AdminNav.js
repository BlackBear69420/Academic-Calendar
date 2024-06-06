import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AddEvent from '../src/Screens/AdminScreens/AddEvent';
import Streams from '../src/Screens/AdminScreens/Streams';
import Department from '../src/Screens/AdminScreens/Department';
import { AdminTab } from './AdminTab';
import EditStream from '../src/Screens/AdminScreens/EditStream';
import EditEvent from '../src/Screens/AdminScreens/EditEvent';
import AdminProfile from '../src/Screens/AdminScreens/AdminProfile';

const Stack = createStackNavigator();

const AdminNav = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>

        <Stack.Screen name="AdminTab" component={AdminTab} />
        <Stack.Screen name="AddEvent" component={AddEvent} />
        <Stack.Screen name="EditStream" component={EditStream} />
        <Stack.Screen name="EditEvent" component={EditEvent} />
        <Stack.Screen name="AddStream" component={Streams} />
        <Stack.Screen name="AddDepartment" component={Department} />
        <Stack.Screen name="AdminProfile" component={AdminProfile} />

        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AdminNav

const styles = StyleSheet.create({})