import * as React from 'react';
import { StyleSheet, StatusBar, Button, TextInput, View } from 'react-native';

import AuthContext from '../context/AuthContext';

function SignInScreen({ navigation }) {
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

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
      <Button title="Sign in" onPress={() => signIn({ password, email })} />
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
