import { View, Text, StyleSheet,Image } from 'react-native'
import React from 'react'
const img = require('../assets/image.png')
const miramar = require('../assets/miramar.jpg')
const erangle = require('../assets/erangle.jpg')
const sanhok = require('../assets/sanhok.jpg')
const PubgFullMatchCard = () => {
  return (
    <View style={styles.container}>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:20}}>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:6}}>
            <Image source={img} alt={'no image'} style={styles.image}/>
            <Text style={styles.text}>PUBG Full Match</Text>
        </View>
        <Text style={styles.text}>Player mode:solo</Text>
      </View>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:30}}>
        <Text style={styles.title}>MAP:Random</Text>
        <Text style={styles.title}>Total player:64</Text>
      </View>
      <View style={{display:'flex',flexDirection:'row',gap:10}}>
        <Image source={erangle} alt='no image' style={styles.imagemap}/>
        <Image source={miramar} alt='no image'style={styles.imagemap}/>
        <Image source={sanhok} alt='no image'style={styles.imagemap}/>
      </View>
      <View style={{display:'flex',flexDirection:'row',gap:60}}>
        <View>
            <Text style={styles.text}>Winnner:</Text>
            <Text>Top:4</Text>
            <Text>Top:22</Text>
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
        width:360,
        height:300,
        borderWidth:2,
        borderColor:'black',
        marginLeft:20,
        display:'flex',
        justifyContent:'center',
        gap:20,
        paddingLeft:14
    },
    image:{
        width:40,
        height:40,
        borderRadius:30
    },
    imagemap:{
        width:100,
        height:80
    },
    text:{fontSize:17,fontWeight:700},
    title:{fontSize:16,fontWeight:700}
})

export default PubgFullMatchCard