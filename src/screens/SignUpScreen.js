import * as React from 'react';
import { StyleSheet, StatusBar, Button, TextInput, View } from 'react-native';

import axios from 'axios';

function SignUpScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const signUpUser = () => {
    console.log('SignUp -> Username = ' + username + ', Password = ' + password + ', Email = ' + email);

    axios({
      method: 'post',
      url: 'http://10.0.2.2:3000/users/',
      data: {
        username: username,
        password: password,
        email: email
      }
    }).then((response) => {
      console.log('Successful SignUp!');

      navigation.navigate('SignIn');
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
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign up"
        onPress={signUpUser}
      />
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

export default SignUpScreen;
