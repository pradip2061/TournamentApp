import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'

const Card = ({image,name}) => {
  return (
    <View>
      <Image source={image} alt='no image'style={styles.map}/>
                    <Text style={styles.title}>{name}</Text>
                    </View>
  )
    
}
const styles = StyleSheet.create({
  title: {
    color: '#333',
    fontSize: 20,
    paddingBottom:20,
    textAlign: 'center',
    fontWeight:400,
  },map:{
    width:244,
    height:137,
    borderRadius:25,
    marginLeft:11
  },
})
export default Card