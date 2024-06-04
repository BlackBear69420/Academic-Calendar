import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Signup from '../src/Screens/Authentication/Signup';
import Login from '../src/Screens/Authentication/Login';
import ForgotPass from '../src/Screens/Authentication/ForgotPass';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Forgot" component={ForgotPass} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthNavigation

const styles = StyleSheet.create({})