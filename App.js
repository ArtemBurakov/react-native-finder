import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SplashScreen from './src/screens/SplashScreen';

import * as SecureStore from 'expo-secure-store';
import AuthContext from './src/context/AuthContext';

import axios from 'axios';
import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();

function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userAccessToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userAccessToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userAccessToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userAccessToken: null,
    }
  );

  React.useEffect(() => {
    // Get FCM token and save it to secure storage
    const getFCMToken = async () => {
      const initialFcmToken = await SecureStore.getItemAsync('FCMToken');

      if (!initialFcmToken) {
        // Register the device with FCM
        await messaging().registerDeviceForRemoteMessages();

        // Get the token
        const fcmToken = await messaging().getToken();
        console.log('Getting FCM token -> ' + fcmToken);

        // Save the token to secure storage
        await SecureStore.setItemAsync('FCMToken', fcmToken);
      }
    }

    getFCMToken();

    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userAccessToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userAccessToken = await SecureStore.getItemAsync('userAccessToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userAccessToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (userAccessToken) => {
        await SecureStore.setItemAsync('userAccessToken', `${userAccessToken}`);
        sendFcmToken();
        dispatch({ type: 'SIGN_IN', token: `${userAccessToken}` });
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync('userAccessToken');
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  const sendFcmToken = async () => {
    const userAccessToken = await SecureStore.getItemAsync('userAccessToken');

    // Get the token from SecureStorage
    const fcmToken = await SecureStore.getItemAsync('FCMToken');
    console.log('Sending FCM Token -> ' + fcmToken);

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
      console.log('FCM Token added successful! Token id -> ', response.data.id);

      await SecureStore.setItemAsync('isFCMTokenSaved', `${true}`);
    }, (error) => {
      console.log(error);
    });
  }

  // Triggered when have new token
  messaging().onTokenRefresh(async (newFcmToken) => {
    const isFcmTokenSaved = await SecureStore.getItemAsync('isFCMTokenSaved');

    if (isFcmTokenSaved) {
      console.log('[FCMService] new token refresg -> ', newFcmToken);
      await SecureStore.setItemAsync('userAccessToken', `${newFcmToken}`);

      sendFcmToken();
    }
  });

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}} />
          ) : state.userAccessToken == null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} options={{headerShown:false}} />
              <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}} />
            </>
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
