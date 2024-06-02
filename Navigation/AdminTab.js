import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddEvent from '../src/Screens/AdminScreens/AddEvent';
import Department from '../src/Screens/AdminScreens/Department';
import Streams from '../src/Screens/AdminScreens/Streams';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // or any other icon set you prefer

const Tab = createBottomTabNavigator();
export function AdminTab() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
  
              if (route.name === 'Events') {
                iconName = 'calendar-clear-outline';
              } else if (route.name === 'Stream') {
                iconName = 'library-outline';
              }
                return <Icon name={iconName} size={size} color={color} />;
            },
            headerShown: false,
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Events" component={AddEvent} />
          <Tab.Screen name="Stream" component={Streams} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  