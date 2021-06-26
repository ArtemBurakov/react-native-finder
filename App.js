import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, PermissionsAndroid } from 'react-native';

import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const App = () => {

  const [locationPermission, setLocationPermission] = useState(false);
  const [initialLatitude, setInitialLatitude] = useState(37.78825);
  const [initialLongitude, setInitialLongitude] = useState(-122.4324);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Finder App Location Permission',
          message:
            'Finder App needs access to your current location ' +
            'so we can know where you are.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission approved');
        setLocationPermission(true);
      } else {
        console.log("Location permission denied");
        setLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestLocationPermission();

    if (locationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setInitialLatitude(position.coords.latitude);
          setInitialLongitude(position.coords.longitude);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <MapView
        style={styles.map}
        showsUserLocation={true}
        region={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
