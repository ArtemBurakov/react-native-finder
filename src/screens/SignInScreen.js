import * as React from 'react';
import {StyleSheet, StatusBar, Button, TextInput, View} from 'react-native';

import AuthContext from '../context/AuthContext';
import axios from 'axios';

function SignInScreen({navigation}) {
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  const {signIn} = React.useContext(AuthContext);

  const signInUser = () => {
    axios({
      method: 'post',
      url: 'http://192.168.88.23:3000/api/v1/users/login',
      data: {
        email: email,
        password: password,
      },
    }).then(
      response => {
        console.log('The log in is done');
        signIn(response.data.token, response.data.email);
      },
      error => {
        console.log(error);
      },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Log in" onPress={() => signInUser()} />
      <Button title="Sign up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
