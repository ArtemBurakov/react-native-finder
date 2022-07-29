import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';

const CustomButton = ({onPress, text, color}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, styles[`container_${color}`]]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
  container_BLUE: {
    backgroundColor: '#0000ff',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CustomButton;
