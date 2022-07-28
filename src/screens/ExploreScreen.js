import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, StatusBar, PermissionsAndroid} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import AuthContext from '../context/AuthContext';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
  interval: 10000,
  fastInterval: 5000,
})
  .then(data => {
    console.log('GPS is ' + data);
    // The user has accepted to enable the location services
    // data can be :
    //  - "already-enabled" if the location services has been already enabled
    //  - "enabled" if user has clicked on OK button in the popup
  })
  .catch(error => {
    console.log(error);
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
  const [markers, setMarkers] = useState([]);

  const {signOut} = React.useContext(AuthContext);

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
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission approved');
        getInitialLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getInitialLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        navigateCamereToLocation(latitude, longitude);
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true},
    );
  };

  const navigateCamereToLocation = (newLatitude, newLongitude) => {
    // Animate camera to your location
    if (mapRef.current) {
      const newCamera = {
        center: {latitude: newLatitude, longitude: newLongitude},
        zoom: 17,
        heading: 0,
        pitch: 45,
        altitude: 5,
      };
      mapRef.current.animateCamera(newCamera, {duration: 2500});
    }
  };

  const sendCoordinatesToServer = async (latitude, longitude) => {
    const session = await EncryptedStorage.getItem('userSession');
    if (session) {
      const email = JSON.parse(session).email;
      const userAccessToken = JSON.parse(session).token;

      axios({
        method: 'post',
        url: 'http://192.168.88.23:3000/api/v1/users/location',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userAccessToken,
        },
        data: {
          email: email,
          last_latitude: `${latitude}`,
          last_longitude: `${longitude}`,
        },
      }).then(
        () => {},
        error => {
          if (error.response.status === 401) {
            console.log('Unauthorized, logging out.');
            signOut();
          }
        },
      );
    }
  };

  const getFriensdLocation = async () => {
    const session = await EncryptedStorage.getItem('userSession');
    if (session) {
      const email = JSON.parse(session).email;
      const userAccessToken = JSON.parse(session).token;

      axios({
        method: 'get',
        url: `http://192.168.88.23:3000/api/v1/users/locations/${email}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userAccessToken,
        },
      }).then(
        response => {
          setMarkers(response.data);
        },
        error => {
          if (error.response.status === 401) {
            console.log('Unauthorized, logging out.');
            signOut();
          }
        },
      );
    }
  };

  useEffect(() => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(response => {
      if (response === true) {
        getInitialLocation();
        const interval = setInterval(() => getFriensdLocation(), 10000);
        return () => {
          clearInterval(interval);
        };
      } else {
        requestLocationPermission();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onUserLocationChange={e => {
          const latitude = e.nativeEvent.coordinate.latitude;
          const longitude = e.nativeEvent.coordinate.longitude;
          sendCoordinatesToServer(latitude, longitude);
        }}>
        {markers.map(user => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: parseFloat(user.last_latitude),
              longitude: parseFloat(user.last_longitude),
            }}
            title={user.username}
          />
        ))}
      </MapView>
    </View>
  );
}

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
