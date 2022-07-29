import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  Image,
  View,
  Pressable,
  SafeAreaView,
} from 'react-native';

import axios from 'axios';
import AuthContext from '../context/AuthContext';
import CustomInput from '../components/customInput/CustomInput';
import CustomButton from '../components/customButton/CustomButton';
import SignInImage from '../../assets/images/SignInImage.png';

function SignInScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = React.useContext(AuthContext);

  const onSignInPressed = () => {
    axios({
      method: 'post',
      url: 'http://192.168.88.23:3000/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
    }).then(
      response => {
        signIn(
          response.data.token,
          response.data.username,
          response.data.email,
        );
      },
      error => {
        console.log(error);
      },
    );
  };
  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Image source={SignInImage} style={styles.logo} />
      <Text style={styles.text}>Sign In</Text>
      <CustomInput placeholder="Email" value={email} setValue={setEmail} />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />
      <CustomButton text="Sign In" onPress={onSignInPressed} color={'BLUE'} />
      <View style={styles.no_account}>
        <Text>Don`t have an account?</Text>
        <Pressable onPress={onSignUpPressed}>
          <Text style={styles.sign_up}>Sign Up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logo: {
    marginTop: 70,
    marginLeft: -20,
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  no_account: {
    marginTop: 5,
    flexDirection: 'row',
  },
  sign_up: {
    color: 'blue',
    marginLeft: 3,
  },
});

export default SignInScreen;
