import { View, Text, StyleSheet,Pressable, TextInput, Modal, Keyboard, TouchableOpacity,ScrollView,Animated } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Freefirefullmatchcard from '../../components/Freefirefullmatchcard'
import axios from 'axios'
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ShimmerBox from '../../components/ShimmerBox'
import LinearGradient from 'react-native-linear-gradient'
import { CheckAdminContext } from '../ContextApi/ContextApi'
import{BASE_URL} from '../../env'



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
     const match =  await axios.get(`${BASE_URL}/khelmela/getff`)
       setCard(match.data.card)
   }
         getmatch()
    } catch (error) {
     console.log(error)
    }
   },[])
  return(
    <ScrollView style={styles.container}>
       
        
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
    }} >
      <TouchableWithoutFeedback onPress={()=>{}}>
    <Text>
      
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
      backgroundColor:'F2F2F2'
    },
   
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 24,
      paddingHorizontal: 15,
      height: 48,
      width: 350,
      marginBottom: 30,
      marginTop: 28,
     marginLeft:25,
     borderWidth:1
      
    },
    searchInput: {
      flex: 1,
      marginHorizontal: 12,
      fontSize: 16,
      color:"black",
    },
    note: {
      color: "#555",
      fontSize: 15,
      marginBottom: 16,
      marginLeft:30,
      paddingBottom:20,
      marginTop:-15
    }
  });

export default FreeFire