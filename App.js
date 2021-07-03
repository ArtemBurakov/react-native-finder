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

const Stack = createStackNavigator();

function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
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
      signIn: async (data) => {
        let userAccessToken;

        axios({
          method: 'post',
          url: 'http://10.0.2.2:3000/users/authorize/',
          data: {
            password: data.password,
            email: data.email
          }
        }).then((response) => {
          userAccessToken = response.data.access_token;
        }, (error) => {
          console.log(error);
        });

        await SecureStore.setItemAsync('userAccessToken', `${userAccessToken}`);
        dispatch({ type: 'SIGN_IN', token: `${userAccessToken}` });
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync('userAccessToken');
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async (data) => {
        axios({
          method: 'post',
          url: 'http://10.0.2.2:3000/users/',
          data: {
            username: data.username,
            password: data.password,
            email: data.email
          }
        }).then((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
        });

        dispatch({ type: 'SIGN_OUT'});
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}} />
          ) : state.userToken == null ? (
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
