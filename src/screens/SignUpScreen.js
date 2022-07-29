import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  Image,
  View,
  SafeAreaView,
  Pressable,
} from 'react-native';

import axios from 'axios';
import CustomInput from '../components/customInput/CustomInput';
import CustomButton from '../components/customButton/CustomButton';
import SignUpImage from '../../assets/images/SignUpImage.png';

function SignUpScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignUpPressed = () => {
    axios({
      method: 'post',
      url: 'http://192.168.88.23:3000/api/v1/users',
      data: {
        username: username,
        password: password,
        email: email,
      },
    }).then(
      response => {
        console.log('Successful SignUp!');
        navigation.navigate('SignIn');
      },
      error => {
        console.log(error);
      },
    );
  };

  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Image source={SignUpImage} style={styles.logo} />
      <Text style={styles.text}>Sign Up</Text>
      <CustomInput placeholder="Email" value={email} setValue={setEmail} />
      <CustomInput
        placeholder="Username"
        value={username}
        setValue={setUsername}
      />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />
      <CustomButton text="Sign Up" onPress={onSignUpPressed} color={'BLUE'} />
      <View style={styles.no_account}>
        <Text>Have an account?</Text>
        <Pressable onPress={onSignInPressed}>
          <Text style={styles.sign_up}>Log In</Text>
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
    width: 250,
    height: 250,
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

export default SignUpScreen;
