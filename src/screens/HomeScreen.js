import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MessagesScreen from './MessagesScreen';
import ExploreScreen from './ExploreScreen';
import FriendsScreen from './FriendsScreen';

import axios from 'axios';
import AuthContext from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import messaging from '@react-native-firebase/messaging';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  React.useEffect(() => {
    createListener();
    getFcmToken();
  }, []);

  const createListener = async () => {
    // Triggered when have new token
    messaging().onTokenRefresh(async (newFcmToken) => {
      const isFcmTokenSaved = await SecureStore.getItemAsync('isFCMTokenSaved');

      if (isFcmTokenSaved) {
        console.log('[FCMService] new token refresg -> ', newFcmToken);
        await SecureStore.setItemAsync('userAccessToken', `${newFcmToken}`);
      }
    });
  }

  // Get FCM token and save it to secure storage
  const getFcmToken = async () => {
    const initialFcmToken = await SecureStore.getItemAsync('FCMToken');

    if (!initialFcmToken) {
      // Register the device with FCM
      await messaging().registerDeviceForRemoteMessages();

      // Get the token
      const fcmToken = await messaging().getToken();
      console.log('Getting FCM token -> ' + fcmToken);

      // Save the token to secure storage
      await SecureStore.setItemAsync('FCMToken', fcmToken);
      sendFcmToken();
    }
  }

  const sendFcmToken = async () => {
    // Get the tokens from SecureStorage
    const fcmToken = await SecureStore.getItemAsync('FCMToken');
    const userAccessToken = await SecureStore.getItemAsync('userAccessToken');

    axios({
      method: 'post',
      url: 'http://10.0.2.2:3000/user-fcm-tokens/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userAccessToken,
      },
      data: {
        registration_token: fcmToken,
      }
    }).then( async (response) => {
      console.log('FCM Token added successful!');
      await SecureStore.setItemAsync('isFCMTokenSaved', `${true}`);
    }, (error) => {
      if (error.response.status === 401) {
        console.log('Unauthorized, logging out.');
        signOut();
      }
    });
  }

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
        activeTintColor: 'royalblue',
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
