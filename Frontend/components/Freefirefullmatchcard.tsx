import { View, Text, StyleSheet,Image } from 'react-native'
import React from 'react'
const freefire = require('../assets/freefire.jpeg')
const bermuda = require('../assets/bermuda.jpg')
const purgatory = require('../assets/pugatory.png')
const kalahari =require('../assets/kalahari.webp')


const Freefirefullmatchcard = () => {
  return (
    <View style={styles.container}>
      <View style={{display:'flex',flexDirection:'row',gap:20, borderWidth:2,borderColor:'black', height:50,justifyContent:'center',alignItems:'center'}}>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:6}}>
            <Image source={freefire} alt={'no image'} style={styles.image}/>
            <Text style={styles.text}>Freefire Full Match</Text>
        </View>
        <Text style={styles.text}>Player mode:solo</Text>
      </View>
      <View style={{display:'flex',flexDirection:'row',gap:90}}>
        <Text style={styles.title}>MAP:Random</Text>
        <Text style={styles.title}>Total player:48</Text>
      </View>
      <View style={{display:'flex',flexDirection:'row',gap:10}}>
        <Image source={bermuda} alt='no image' style={styles.imagemap}/>
        <Image source={purgatory} alt='no image'style={styles.imagemap}/>
        <Image source={kalahari} alt='no image'style={styles.imagemap}/>
      </View>
      <View style={{display:'flex',flexDirection:'row',gap:60}}>
        <View>
            <Text style={styles.text}>Winnner:</Text>
            <Text>Top:3</Text>
            <Text>Top:15</Text>
        </View>
        <View>
        <Text style={styles.text}>Odds:</Text>
        <Text>3x</Text>
        <Text>1.5x</Text>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        width:340,
        height:350,
        borderWidth:2,
        borderColor:'black',
        backgroundColor:'white',
        marginLeft:20,
        display:'flex',
      
        gap:15,
        paddingLeft:5,
        paddingTop:1

    },
    image:{
        width:40,
        height:40,
        borderRadius:30,

    },
    imagemap:{
        width:100,
        height:80
    },
    text:{ 
      fontSize:12.5,
      fontWeight:700,
    },
    title:{fontSize:12.5,
      fontWeight:700

    }
})

export default Freefirefullmatchcard