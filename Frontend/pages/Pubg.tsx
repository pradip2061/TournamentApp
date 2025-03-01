import { View, Text, StyleSheet,Pressable, TextInput, Modal, Keyboard, TouchableOpacity,ScrollView,Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Freefirefullmatchcard from '../components/Freefirefullmatchcard'
import axios from 'axios'
import { FlatList } from 'react-native-gesture-handler'
import ShimmerBox from '../components/ShimmerBox'
import PubgFullMatchCard from '../components/PubgFullMatchCard';
const img = require('../assets/image.png');
const miramar = require('../assets/miramar.jpg');
const erangle = require('../assets/erangle.jpg');
const sanhok = require('../assets/sanhok.jpg');
const Pubg = ({navigation}) => {
  const[data,setData]=useState([])
  useEffect(()=>{
    const getmatchCard = ()=>{
      axios.get('http://30.30.6.248:3000/khelmela/getpubg')
      .then((response)=>{
        setData(response.data.data)
        console.log(data)
      })
    }
    getmatchCard()
  },[])
  return (
    <ScrollView style={styles.container}>
        
        <View style={styles.header}>
         <AntDesign name="arrowleft" size={30} color="white"   onPress={()=>navigation.navigate('Homes')} /> 
         <Text style={styles.headerTitle}> Full Map Matches</Text>
       </View>
       {/* Search Bar */}
       <View style={styles.searchContainer}>
         <Ionicons name="menu-outline" size={24} color="black" />
         <TextInput
           style={styles.searchInput}
           placeholder="Search your match"
           placeholderTextColor="#666"
         />
         <FontAwesome5 name="search" size={20} color="black" />
       </View>
       <Text style={styles.note}>
         Note: All matches are made by the admin everyday in same time
        </Text>
        <FlatList data={data} keyExtractor={(item)=>item.id}
        renderItem={({item})=>(<PubgFullMatchCard matches={item} key={item._id}/>)} contentContainerStyle={{ gap: 30,paddingBottom:30 }} scrollEnabled={false}/>
</ScrollView>

    )
};


const styles = StyleSheet.create({
  container: {
    
    backgroundColor: 'rgb(0,18,64)',
    height:'100%'
    
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,  
    marginRight: 100,
    marginLeft:10
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 40,
    color:'white',
    
    width:250,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 48,
    width: 310,
    marginBottom: 12,
    marginTop: 30,
   marginLeft:45
    
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
  },
  note: {
    color: "#FF4444",
    fontSize: 13,
    marginBottom: 16,
    marginLeft:30
  }
});
export default Pubg;
