import * as React from 'react';
import { StyleSheet, StatusBar, Button, Text, View } from 'react-native';

import AuthContext from './../context/AuthContext';

function MessagesScreen() {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Text>Messages!</Text>
      <Button title="Sign out" onPress={signOut} />
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

export default MessagesScreen;
