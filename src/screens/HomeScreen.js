import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MessagesScreen from './MessagesScreen';
import ExploreScreen from './ExploreScreen';
import FriendsScreen from './FriendsScreen';

const Tab = createBottomTabNavigator();

function HomeScreen() {
    return (
      <Tab.Navigator
        initialRouteName='Explore'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Messages') {
              iconName = focused
                ? 'chatbubbles'
                : 'chatbubbles-outline';
            } else if (route.name === 'Explore') {
              iconName = focused
              ? 'location'
              : 'location-outline';
            } else if (route.name === 'Friends') {
              iconName = focused
              ? 'people'
              : 'people-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Messages"
          component={MessagesScreen}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
        />
        <Tab.Screen
          name="Friends"
          component={FriendsScreen}
        />
      </Tab.Navigator>
    );
};

export default HomeScreen;
