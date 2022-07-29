import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SplashScreen from './src/screens/SplashScreen';

import EncryptedStorage from 'react-native-encrypted-storage';
import AuthContext from './src/context/AuthContext';

const Stack = createStackNavigator();

function App({}) {
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
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      try {
        let userAccessToken;
        const session = await EncryptedStorage.getItem('userSession');
        if (session) {
          // Restore token stored in encrypted storage
          userAccessToken = JSON.parse(session).token;
          console.log('User access token restored successfully');
        }

        // After restoring token, we may need to validate it in production apps
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        dispatch({type: 'RESTORE_TOKEN', token: userAccessToken});
      } catch (error) {
        console.log('Restoring token failed: ' + error);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (userAccessToken, username, email) => {
        try {
          await EncryptedStorage.setItem(
            'userSession',
            JSON.stringify({
              username: username,
              email: email,
              token: userAccessToken,
            }),
          );
          dispatch({type: 'SIGN_IN', token: `${userAccessToken}`});
        } catch (error) {
          console.log('Error while saving user log in information: ' + error);
        }
      },
      signOut: async () => {
        try {
          await EncryptedStorage.removeItem('userSession');
          dispatch({type: 'SIGN_OUT'});
        } catch (error) {
          console.log(
            'Error while removing user information on log out: ' + error,
          );
        }
      },
    }),
    [],
  );

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator>
            {state.isLoading ? (
              // We haven't finished checking for the token yet
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{headerShown: false}}
              />
            ) : state.userAccessToken == null ? (
              // No token found, user isn't signed in
              <>
                <Stack.Screen
                  name="SignIn"
                  component={SignInScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SignUpScreen}
                  options={{headerShown: false}}
                />
              </>
            ) : (
              // User is signed in
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

export default App;
