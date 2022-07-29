import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ActivityIndicator size="large" color="blue" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
