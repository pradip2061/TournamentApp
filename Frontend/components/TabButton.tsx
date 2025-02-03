import { View, Text, TouchableOpacity,Image, StyleSheet} from 'react-native'
import React from 'react'


const TabButton = ({images}) => {
  return (
<Image source={images} alt='no image' style={styles.logo}/>
  )
}
const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 70,
    borderRadius:40
  }})
export default TabButton