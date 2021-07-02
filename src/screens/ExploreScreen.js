import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, PermissionsAndroid } from 'react-native';
import { useIsFocused } from "@react-navigation/native";

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
  interval: 10000,
  fastInterval: 5000,
})
  .then((data) => {
    console.log(data);
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
  const isFocused = useIsFocused();

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
    console.log('navigateCamereToLocation');

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

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(response => {
      if (response === true) {
        getInitialLocation();
      }
      else {
        requestLocationPermission();
      }
    });
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        // onUserLocationChange={
        //   (e) => {
        //     setInitialLatitude(e.nativeEvent.coordinate.latitude);
        //     setInitialLongitude(e.nativeEvent.coordinate.longitude);
        //   }
        // }
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

export default ExploreScreen;
