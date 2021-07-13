import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, PermissionsAndroid } from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import messaging from '@react-native-firebase/messaging';

RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
  interval: 10000,
  fastInterval: 5000,
})
  .then((data) => {
    console.log('GPS is ' + data);
    // The user has accepted to enable the location services
    // data can be :
    //  - "already-enabled" if the location services has been already enabled
    //  - "enabled" if user has clicked on OK button in the popup
  })
  .catch((err) => {
    console.log(err);
    // The user has not accepted to enable the location services or something went wrong during the process
    // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
    // codes :
    //  - ERR00 : The user has clicked on Cancel button in the popup
    //  - ERR01 : If the Settings change are unavailable
    //  - ERR02 : If the popup has failed to open
    //  - ERR03 : Internal error
  });

function ExploreScreen() {
  const mapRef = useRef(null);
  const [markerLatitude, setMarkerLatitude] = useState(49.4551195854);
  const [markerLongitude, setMarkerLongitude] = useState(32.0339957535);

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
        getInitialLocation();
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getInitialLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        navigateCamereToLocation(latitude, longitude);
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true }
    );
  }

  const navigateCamereToLocation = (newLatitude, newLongitude) => {
    // Animate camera to your location
    if (mapRef.current) {
      const newCamera = {
        center: { latitude: newLatitude, longitude: newLongitude },
        zoom: 17,
        heading: 0,
        pitch: 45,
        altitude: 5,
      }
      mapRef.current.animateCamera(newCamera, { duration: 2500 });
    }
  }

  const sendCoordinatesToServer = async (latitude, longitude) => {
    console.log('Sending coordinates to server');

    const userAccessToken = await SecureStore.getItemAsync('userAccessToken');

    axios({
      method: 'post',
      url: 'http://10.0.2.2:3000/userCoordinates/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userAccessToken,
      },
      data: {
        latitude: `${latitude}`,
        longitude: `${longitude}`
      }
    }).then((response) => {
      console.log('Coordinates send successful!');
    }, (error) => {
      if (error.response.status === 401) {
        console.log('Unauthorized, logging out.');
        signOut();
      }
    });
  }

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(response => {
      if (response === true) {
        getInitialLocation();
      }
      else {
        requestLocationPermission();
      }
    });

    messaging().onMessage(async remoteMessage => {
      setMarkerLatitude(parseFloat(remoteMessage.data.latitude));
      setMarkerLongitude(parseFloat(remoteMessage.data.longitude));
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onUserLocationChange={
          (e) => {
            latitude = e.nativeEvent.coordinate.latitude;
            longitude = e.nativeEvent.coordinate.longitude;

            sendCoordinatesToServer(latitude, longitude);
          }
        }
      >
        {/* <Marker
          coordinate={{ latitude : markerLatitude , longitude : markerLongitude }}
        /> */}
      </MapView>
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

export default ExploreScreen;
