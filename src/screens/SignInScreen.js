import * as React from 'react';
import { StyleSheet, StatusBar, Button, TextInput, View } from 'react-native';

import AuthContext from '../context/AuthContext';
import axios from 'axios';

function SignInScreen({ navigation }) {
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  const signInUser = () => {
    console.log('SignIn -> Email = ' + email + ', Password = ' + password);

    axios({
      method: 'post',
      url: 'http://10.0.2.2:3000/users/authorize/',
      data: {
        email: email,
        password: password
      }
    }).then((response) => {
      console.log('SignIn successful');
      signIn(response.data.data.access_token, response.data.data.email);
    }, (error) => {
      console.log(error);
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signInUser()} />
      <Button title="Sign up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SignInScreen;
