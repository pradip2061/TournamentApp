import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';

const TabButton = ({images, toggleset}) => {
  console.log(toggleset);
  console.log(images);
  return (
    <Image
      source={images}
      alt="no image"
      style={
        ['freefire', 'pubg', 'cod'].includes(toggleset)
          ? styles.logohover
          : styles.logo
      }
    />
  );
};
const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  logohover: {
    borderColor: 'orange',
    borderWidth: 2,
    width: 70,
    height: 70,
    borderRadius: 40,
  },
});
export default TabButton;
