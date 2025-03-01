import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";
import TdmCard from "../components/TdmCard";
import { FlatList, ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { CheckAdminContext } from "./ContextApi";

// const Box = ({ style, label }) => (
//   <View
//     style={[
//       {
//         width: 60,
//         height: 40,
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: 5,
//         borderWidth: 1,
//         backgroundColor:'grey',
//         marginLeft:10
//       },
//       style,
//     ]}
//   >
//     <Text>{label}</Text>
//   </View>
// );

const TDM = ({navigation}) => {
const[data,setData]=useState([])
const{checkrole,checkadmin}=useContext(CheckAdminContext);
      useEffect(()=>{
        checkrole()
      },[])
useEffect(()=>{
    const getcard =()=>{
      axios.get(`${process.env.baseUrl}/khelmela/gettdm`)
      .then((response)=>{
        setData(response.data.data)
      })
    }
    getcard()
},[])
  return (
    <ScrollView style={styles.container}>
       <View style={styles.header}>
               <AntDesign name="arrowleft" size={30} color="white"   onPress={()=>navigation.navigate('Homes')} /> 
               <Text style={styles.headerTitle}> TDM</Text>
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
          checkadmin === "admin"?
                  <TouchableOpacity>
                  <Text>admin</Text>
                </TouchableOpacity>:<Text>hello user</Text>
        }
      <FlatList data={data} keyExtractor={(item)=>item._id} renderItem={({item})=>(<TdmCard matches={item} key={item._id} />)}  contentContainerStyle={{ gap: 30,paddingBottom:30 }} scrollEnabled={false}/>
      </ScrollView>
  );
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
  },
});
export default TDM;













