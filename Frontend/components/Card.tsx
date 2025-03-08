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
    color: 'black',
    fontSize: 20,
    paddingBottom:20,
    fontWeight:800,
    marginLeft:25
  },map:{
    width:220,
    height:130,
    borderRadius:40,
  },
})
export default Card