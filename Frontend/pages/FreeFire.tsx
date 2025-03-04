import { View, Text, StyleSheet,Pressable, TextInput, Modal, Keyboard, TouchableOpacity,ScrollView,Animated } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Freefirefullmatchcard from '../components/Freefirefullmatchcard'
import axios from 'axios'
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ShimmerBox from '../components/ShimmerBox'
import LinearGradient from 'react-native-linear-gradient'
import { CheckAdminContext } from './ContextApi'




const FreeFire = ({navigation}) => {
    const[card,setCard]=useState([])
    const{checkrole,checkadmin}=useContext(CheckAdminContext);
    const[createModal,setCreateModal]=useState(false)
    useEffect(()=>{
      checkrole()
    },[])
  useEffect(()=>{
    try {
     const getmatch=async()=>{
     const match =  await axios.get(`${process.env.baseUrl}/khelmela/getff`)
       setCard(match.data.card)
   }
         getmatch()
    } catch (error) {
     console.log(error)
    }
   },[])
  return(
    <ScrollView style={styles.container}>
       <LinearGradient
            colors={["#0f0c29", "#302b63", "#24243e"]}
            style={styles.gradient}
          ></LinearGradient>
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
        {
                      card.length !==0 ?  <FlatList
                      data={card}
                      scrollEnabled={false} 
                      keyExtractor={(item,id) =>id.toString() }
                      renderItem={({ item }) =>  <Freefirefullmatchcard  matches ={item}/>}
                    /> :<ShimmerBox/>
                    }
                    <Modal visible={createModal} animationType='fade' transparent >
  <TouchableWithoutFeedback onPress={()=>setCreateModal(false)}>
  <View style={{ flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"}} >
      <TouchableWithoutFeedback onPress={()=>{}}>
    <Text>
      hello guys
    </Text>
    </TouchableWithoutFeedback>
  </View>
  </TouchableWithoutFeedback>
</Modal>
</ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      width:"100%",
      height:'100%',
      paddingRight:15,
      backgroundColor:'white'
    },
    linearColor:{
flex:1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,  
      marginRight: 100,
      marginLeft:60
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
     marginLeft:25
      
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

export default FreeFire
