import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from '../src/Screens/HomePage/Home';
import Profile from '../src/Screens/HomePage/Profile';

const Stack = createStackNavigator();

const StudentNav = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StudentNav

const styles = StyleSheet.create({})