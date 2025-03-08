import { View, Text, StyleSheet,Pressable, TextInput, Modal, Keyboard, TouchableOpacity,ScrollView,Animated } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import Entypo from 'react-native-vector-icons/Entypo'
import MatchCard from '../../components/MatchCard'
import { FlatList} from 'react-native-gesture-handler'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ShimmerBox from '../../components/ShimmerBox'
import { CheckAdminContext } from '../ContextApi/ContextApi'
import TdmCard from '../../components/TdmCard'
const TDM = ({navigation}) => {
  const[page,setPage]=useState(1)
  const[data,setData]=useState([])
  const[trigger,setTrigger]=useState('')
  const[visible,setVisible]=useState(false)
  const[message,setMessage]=useState('')
  const{getdata}=useContext(CheckAdminContext)
    const [matchDetails, setMatchDetails] = useState({
      show: false,
      showDetail: true,
        match:'1v1',
      gameName: '',
      betAmount: '',
      Time:'',

    });
    console.log(matchDetails.match)
    const modal =(messages)=>{
      setVisible(true)
      setMessage(String(messages))
      setTimeout(()=>{
        setVisible(false)
        setMessage('')
      },1000)
    }
    const handleOutsidePress = () => {
        Keyboard.dismiss(); // To dismiss keyboard if it's open
        setMatchDetails((prev)=>({...prev,show:false})); // Close the modal
      }

      // const playerOptions = [
      //   { id: 1, label: "1v1" },
      //   { id: 2, label: "2v2" },
      //   { id: 3, label: "3v3" },
      // ];

      const sendData =async(e)=>{
        e.preventDefault()
     try {
      if(!matchDetails.betAmount || !matchDetails.gameName){
        modal('fill All fields')
        return
      }
      const token = await AsyncStorage.getItem('token')
      await axios.post(`${process.env.baseUrl}/khelmela/creatematchtdm`,{matchDetails},{
        headers:{
          Authorization:`${token}`
        }
      })
      .then((response)=>{
        console.log(response)
     modal(response.data.message)
      setTrigger('done')
      setMatchDetails((prev)=>({...prev,show:false}))
      matchidSend(response.data.newMatch._id)
      })
     } catch (error) {
      const errorMessage = error.response.data.message || "exceed the limit";
      modal(errorMessage)
     }
      }  
      
      const matchidSend =async(matchId)=>{
      console.log(matchId)
     try {
      const token = await AsyncStorage.getItem('token')
      await axios.post(`${process.env.baseUrl}/khelmela/addinhosttdm`,{matchId},{
        headers:{
          Authorization:`${token}`
        }
      })
     } catch (error) {
      const errorMessage = error.response?.data?.message || "exceed the limit";
      modal(errorMessage)
     }
      } 


      useEffect(()=>{
        try {
          const getMatches = async()=>{
            await axios.get(`${process.env.baseUrl}/khelmela/gettdm`)
            .then((response)=>{
              setData(response.data.data)
            })
          }
          getMatches()
        } catch (error) {
          setMessage(error.response.data.message)
        }
      },[getdata,trigger])
      
  return (
    <ScrollView>
    <View style={styles.container}>
       <View style={styles.header}>
        <AntDesign name="arrowleft" size={30} color="white" onPress={()=>navigation.navigate('Homes')} />
        <Text style={styles.headerTitle}>Clash Squad Matches</Text>
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
        Note: All matches are made by host player not admin
      </Text>
      <Pressable style={styles.createButton} onPress={() => setMatchDetails((prev)=>({...prev,show:true}))}>
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.createButtonText}>Create</Text>
      </Pressable>
      <View style={styles.liveMatches}>
        <Entypo name="game-controller" size={24} color="black" />
        <Text style={styles.liveMatchesText}>Live Matches</Text>
      </View>
      <View style={{paddingBottom:10}}>
                  <View>
                    {
                      data?.length  ?  <FlatList
                      data={data}
                      scrollEnabled={false} 
                      keyExtractor={(item,id) =>id.toString() }
                      renderItem={({ item }) => <TdmCard matches={item} />}
                    /> :<ShimmerBox/>
                    }
                  </View>
      </View>
      <Modal visible={matchDetails.show}  transparent animationType='fade' onRequestClose={handleOutsidePress}>
      <View style={styles.modal}>
        <Text style={{borderColor:'black',borderBottomWidth:2,width:100,height:4,marginTop:5,marginLeft:140}}>hello</Text>
        <Text style={styles.modalTitle}>Create your match</Text>
        <ScrollView>
        <View style={{marginLeft:40}}>
            <Text style={{fontSize:20,fontWeight:700}}>Room mode</Text>
            <View style={{display:'flex',flexDirection:'row',gap:50,alignItems:'center',marginTop:20,}}>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,match:'1v1'}))} style={ matchDetails.match === '1v1' ?styles.toggle:null}><Text style={ matchDetails.match === '1v1' ? styles.toggleText:styles.toggleTextN}>1v1</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,match:'2v2'}))} style={ matchDetails.match === '2v2' ?styles.toggle:null}><Text style={matchDetails.match === '2v2' ? styles.toggleText:styles.toggleTextN}>2v2</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,match:'3v3'}))} style={ matchDetails.match === '3v3' ?styles.toggle:null}><Text style={matchDetails.match === '3v3' ? styles.toggleText:styles.toggleTextN}>3v3</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,match:'4v4'}))} style={ matchDetails.match === '4v4' ?styles.toggle:null}><Text style={matchDetails.match === '4v4' ? styles.toggleText:styles.toggleTextN}>4v4</Text></TouchableOpacity>
            </View>
        </View>
                <View>
                <View style={{marginLeft:40}}>
            <View style={{display:'flex',marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700}}> 
                    Game name:
                </Text>
                <TextInput placeholder='Give your name' style={styles.textinput} value={matchDetails.gameName} onChangeText={(text)=>setMatchDetails((prev)=>({...prev,gameName:text}))}/>
               
            </View>
            <View style={{display:'flex',marginTop:30}}>
                <Text style={{fontSize:20,fontWeight:700}}>
                    Entry Fee:
                </Text>
                <TextInput placeholder='Enter the amount'  keyboardType="numeric" style={styles.textinput} value={matchDetails.betAmount} onChangeText={(text)=>setMatchDetails((prev)=>({...prev,betAmount:text}))}/>
            </View>
            <View style={{display:'flex',marginTop:30}}>
                <Text style={{fontSize:20,fontWeight:700}}>
                    Time:
                </Text>
                <TextInput placeholder='Enter the time'   style={styles.textinput} value={matchDetails.Time} onChangeText={(text)=>setMatchDetails((prev)=>({...prev,Time:text}))}/>
            </View>
                  <TouchableOpacity style={styles.button} onPress={sendData}><Text style={{ fontSize: 25,fontWeight:700,color:'white',textAlign:'center',marginTop:6}}>Publish</Text></TouchableOpacity>
                </View>
                </View>
        </ScrollView>
      </View>
      </Modal>
      <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.title}>{message}</Text>
        </View>
      </View>
    </Modal>
    </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(0,18,64)',
      padding: 16,
      paddingBottom:190
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 16,
      color:'white'
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      borderRadius: 24,
      paddingHorizontal: 16,
      height: 48,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      marginHorizontal: 12,
      fontSize: 16,
    },
    note: {
      color: "#FF4444",
      fontSize: 12,
      marginBottom: 16,
      marginLeft:30
    }
,
createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "orange",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignSelf: "flex-end",
  },
  createButtonText: {
    marginLeft: 8,
    fontWeight: 600,
    color:'white',
    fontSize:17
  }  ,liveMatches: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    padding: 8,
    borderRadius: 8,
    width:135,
    marginLeft:10,
  },
  liveMatchesText: {
    marginLeft: 8,
    fontWeight: "600",
  },
  modal:{
    width:'100%',
    height:'100%',
    backgroundColor:'white',
    paddingBottom:40,
    zIndex:20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    marginTop:20
  },
  toggle:{
    height:40,
    borderRadius:30,
    backgroundColor:'orange',
    display:'flex',
    justifyContent:'center',
    padding:5
  },
  toggleText:{
    color:'white',
    fontSize:20
  },
  toggleTextN:{
    fontSize:20,
  },
  select:{
    width:60,
    height:40,
    backgroundColor:'orange',
    display:'flex',
    justifyContent:'center',
     borderRadius:30,
     alignItems:'center',
  },
  round:{
    width:60,
    height:40,
    backgroundColor:'orange',
    display:'flex',
    justifyContent:'center',
     borderRadius:30,
     alignItems:'center',
     
  },
  coin:{
    width:70,
    height:40,
    backgroundColor:'orange',
    display:'flex',
    justifyContent:'center',
     borderRadius:30,
     alignItems:'center',
  },
  selectText:{
    color:'white',
    fontSize:20
  },
  noselectText:{
    color:'black',
    fontSize:20
  },
  flatListContainer:{
    gap:50,
    marginLeft:40,
    display:'flex',
    alignItems:'center',
    marginTop:16
  },
  roundContainer:{
    gap:50,
    display:'flex',
    alignItems:'center',
    marginTop:16
  },
  textinput:{
    width:300,
   height:50,
   backgroundColor:'rgb(227,227,227)',
   paddingLeft:20,
   marginTop:10,
   fontSize:17
  },
  button:{
    width:300,
    height:50,
    borderRadius:20,
    backgroundColor:'orange',
    marginTop:40
},  
modalContainer: {
  flex: 1,
  alignItems: 'center',
  marginTop:650
// Semi-transparent background
},
modalContent: {
  width: 320,
  padding: 20,
  backgroundColor: 'rgb(255, 255, 255)',
  borderRadius: 10,
  alignItems: 'center',
  borderWidth:2,
  borderColor:'orange',
  marginTop:35
},
title: {
  fontSize: 20,
  fontWeight:900
},
 
})
export default TDM