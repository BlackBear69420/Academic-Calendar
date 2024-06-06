import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../src/Screens/AdminScreens/HomeScreen';
import Streams from '../src/Screens/AdminScreens/Streams';
import colors from '../src/assests/colors';
import AdminProfile from '../src/Screens/AdminScreens/AdminProfile';

const Tab = createBottomTabNavigator();
export function AdminTab() {
    return (
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
        activeColor={colors.primary}
        activeIndicatorStyle={{backgroundColor:'aliceblue'}}
          navigationState={state}
          style={{backgroundColor:colors.lightBackground}}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Streams"
        component={Streams}
        options={{
          tabBarLabel: 'Streams',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="ballot-outline" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={AdminProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
    );
  }
  