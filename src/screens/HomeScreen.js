import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import SearchScreen from './SearchScreen';
import ExploreScreen from './ExploreScreen';
import FriendsScreen from './FriendsScreen';

import axios from 'axios';
import AuthContext from '../context/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const {signOut} = React.useContext(AuthContext);

  React.useEffect(() => {
    createListener();
    getFcmToken();
  }, []);

  const createListener = async () => {
    // Triggered when have new token
    messaging().onTokenRefresh(async newFcmToken => {
      try {
        const isFcmTokenSaved = JSON.parse(
          await EncryptedStorage.getItem('isFCMTokenSaved'),
        );
        console.log('isFCMTokenSaved: ' + isFcmTokenSaved);

        if (isFcmTokenSaved) {
          console.log('[FCMService] new token refresg -> ', newFcmToken);
          await EncryptedStorage.setItem(
            'FCMToken',
            JSON.stringify(newFcmToken),
          );
        }
      } catch (error) {
        console.log('Refreshing token failed: ' + error);
      }
    });
  };

  // Get FCM token and save it to secure storage
  const getFcmToken = async () => {
    try {
      const initialFcmToken = JSON.parse(
        await EncryptedStorage.getItem('FCMToken'),
      );
      console.log('initialFcmToken: ' + initialFcmToken);

      if (!initialFcmToken) {
        // Register the device with FCM
        await messaging().registerDeviceForRemoteMessages();

        // Get the token
        const fcmToken = await messaging().getToken();
        console.log('Getting FCM token: ' + fcmToken);

        // Save the token to secure storage
        await EncryptedStorage.setItem('FCMToken', JSON.stringify(fcmToken));
        await sendFcmToken();
      }
    } catch (error) {
      console.log('Restoring token failed: ' + error);
    }
  };

  const sendFcmToken = async () => {
    // Get the tokens from SecureStorage
    const fcmToken = JSON.parse(await EncryptedStorage.getItem('FCMToken'));
    const session = await EncryptedStorage.getItem('userSession');

    if (session && fcmToken) {
      const email = JSON.parse(session).email;
      const userAccessToken = JSON.parse(session).token;

      axios({
        method: 'post',
        url: 'http://192.168.88.23:3000/api/v1/fcm-token',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userAccessToken,
        },
        data: {
          email: email,
          registration_token: fcmToken,
        },
      }).then(
        async response => {
          console.log('FCM Token added successful!');
          try {
            await EncryptedStorage.setItem(
              'isFCMTokenSaved',
              JSON.stringify(true),
            );
          } catch (error) {
            console.log('Error while adding fcm token: ' + error);
          }
        },
        error => {
          if (error.response.status === 401) {
            console.log('Unauthorized, logging out.');
            signOut();
          }
        },
      );
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'earth' : 'earth-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        activeTintColor: 'royalblue',
        inactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
