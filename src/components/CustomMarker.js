import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

function CustomMarker({user}) {
  return (
    <View>
      <View style={styles.marker}>
        <Text style={styles.text}>{user.username}</Text>
      </View>
      <View style={styles.arrowBorder} />
    </View>
  );
}
//styles for our custom marker.
const styles = StyleSheet.create({
  marker: {
    padding: 10,
    backgroundColor: '#7cfc00',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#7cfc00',
    borderWidth: 6,
    alignSelf: 'center',
  },
});

export default CustomMarker;
