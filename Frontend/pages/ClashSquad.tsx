import { View, Text, StyleSheet,Pressable, TextInput, Modal, Keyboard, TouchableOpacity,ScrollView,Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import Entypo from 'react-native-vector-icons/Entypo'
import MatchCard from '../components/MatchCard'
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import ShimmerBox from '../components/ShimmerBox'
const ClashSquad = ({navigation}) => {
  const[page,setPage]=useState(1)
  const[data,setData]=useState([])
  const[trigger,setTrigger]=useState('')
  const[visible,setVisible]=useState(false)
  const[message,setMessage]=useState('')
    const [matchDetails, setMatchDetails] = useState({
      show: false,
      showDetail: true,
      player: '1v1',
      ammo: 'yes',
      headshot: 'yes',
      skill: 'No',
      round: 13,
      coin: 'Default',
        match:'clashsquad',
      gameName: '',
      betAmount: '',
    });
    
    const modal =(messages)=>{
      setVisible(true)
      setMessage(messages)
      setTimeout(()=>{
        setVisible(false)
        setMessage('')
      },1000)
    }
    const handleOutsidePress = () => {
        Keyboard.dismiss(); // To dismiss keyboard if it's open
        setMatchDetails((prev)=>({...prev,show:false})); // Close the modal
      }

      const playerOptions = [
        { id: 1, label: "1v1" },
        { id: 2, label: "2v2" },
        { id: 3, label: "3v3" },
        { id: 4, label: "4v4" },
      ];
    
      const roundOptions = [
        { id: 1, label: 7 },
        { id: 2, label: 9},
        { id: 3, label: 13 },
      ];
    
      const coinOptions = [
        { id: 1, label: "Default" },
        { id: 2, label: "9999" },
      ];
        

      const sendData =async(e)=>{
        e.preventDefault()
     try {
      const token = await AsyncStorage.getItem('token')
      await axios.post('http://30.30.17.80:3000/khelmela/create',{matchDetails},{
        headers:{
          Authorization:`${token}`
        }
      })
      .then((response)=>{
     modal(response.data.message)
      setTrigger('done')
      })
     } catch (error) {
      const errorMessage = error.response?.data?.message || "exceed the limit";
      modal(errorMessage)
     }
      }  
      useEffect(()=>{
        try {
          const getMatches = async()=>{
            await axios.get(`http://30.30.17.80:3000/khelmela/get?page=${page}`)
            .then((response)=>{
              setData(response.data.card)
            })
          }
          getMatches()
        } catch (error) {
          Alert.alert(error.response.data.message)
        }
      },[trigger,page])
  return (
    
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
      <View style={{paddingBottom:260}}>
         
                  <View>
                    {
                      data.length !==0 ?  <FlatList
                      data={data}
                      keyExtractor={(item,id) =>id.toString() }
                      renderItem={({ item }) => <MatchCard match={item} />}
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
            <View style={{display:'flex',flexDirection:'row',gap:100,alignItems:'center',marginTop:20,}}>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,showDetail:true,match:'clashsquads'}))} style={ matchDetails.showDetail ?styles.toggle:null}><Text style={ matchDetails.showDetail ? styles.toggleText:styles.toggleTextN}>Clash Squad</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,showDetail:false,match:'lonewolf'}))} style={ !matchDetails.showDetail ?styles.toggle:null}><Text style={!matchDetails.showDetail ? styles.toggleText:styles.toggleTextN}>Lone Wolf</Text></TouchableOpacity>
            </View>
        </View>
        {
           matchDetails.showDetail ? <View style={{marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700,marginLeft:40}}>Player</Text>
                <FlatList data={playerOptions} keyExtractor={(item,id)=>item.id.toString()} renderItem={({item})=>
                  <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,player:item.label}))} style={matchDetails.player === item.label ?styles.select:null}><Text style={ matchDetails.player === item.label ? styles.selectText:styles.noselectText}>{item.label}</Text></TouchableOpacity>
                } horizontal   contentContainerStyle={styles.flatListContainer}/>
                <View style={{marginLeft:40,marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700}}>Limited ammo</Text>
            <View style={{display:'flex',flexDirection:'row',gap:100,alignItems:'center',marginTop:20,}}>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,ammo:'yes'}))} style={ matchDetails.ammo == 'yes' ?styles.toggle:null}><Text style={matchDetails.ammo == 'yes' ? styles.toggleText:styles.toggleTextN}>Yes</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,ammo:'No'}))} style={ matchDetails.ammo =='No' ?styles.toggle:null}><Text style={matchDetails.ammo == 'No' ? styles.toggleText:styles.toggleTextN}>No</Text></TouchableOpacity>
            </View>
                </View>
                <View style={{marginLeft:40,marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700}}>Headshot</Text>
            <View style={{display:'flex',flexDirection:'row',gap:100,alignItems:'center',marginTop:20,}}>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,headshot:'yes'}))} style={ matchDetails.headshot == 'yes' ?styles.toggle:null}><Text style={ matchDetails.headshot== 'yes' ? styles.toggleText:styles.toggleTextN}>Yes</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,headshot:'No'}))} style={ matchDetails.headshot =='No' ?styles.toggle:null}><Text style={matchDetails.headshot== 'No' ? styles.toggleText:styles.toggleTextN}>No</Text></TouchableOpacity>
            </View>
                </View>
                <View style={{marginLeft:40,marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700}}>Character Skill</Text>
            <View style={{display:'flex',flexDirection:'row',gap:100,alignItems:'center',marginTop:20,}}>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,skill:'yes'}))} style={ matchDetails.skill == 'yes' ?styles.toggle:null}><Text style={ matchDetails.skill == 'yes' ? styles.toggleText:styles.toggleTextN}>Yes</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,skill:'No'}))} style={ matchDetails.skill =='No' ?styles.toggle:null}><Text style={matchDetails.skill == 'No' ? styles.toggleText:styles.toggleTextN}>No</Text></TouchableOpacity>
            </View>
            <View style={{display:'flex',marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700}}>
                    Rounds
                </Text>
                <FlatList data={roundOptions} keyExtractor={(item,id)=>item.id.toString()} renderItem={({item})=>
                  <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,round:item.label}))} style={ matchDetails.round === item.label ?styles.round:null}><Text style={matchDetails.round === item.label ? styles.selectText:styles.noselectText}>{item.label}</Text></TouchableOpacity>
                } horizontal   contentContainerStyle={styles.roundContainer}/>
            </View>
            <View style={{display:'flex',marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700}}>
                    Coin:
                </Text>
                <FlatList data={coinOptions} keyExtractor={(item,id)=>item.id.toString()} renderItem={({item})=>
                  <TouchableOpacity onPress={()=>setMatchDetails((prev)=>({...prev,coin:item.label}))} style={ matchDetails.coin === item.label ?styles.coin:null}><Text style={matchDetails.coin === item.label ? styles.selectText:styles.noselectText}>{item.label}</Text></TouchableOpacity>
                } horizontal   contentContainerStyle={styles.roundContainer}/>
            </View>
            <View style={{display:'flex',marginTop:40}}>
                <Text style={{fontSize:20,fontWeight:700}}> 
                    Game name:
                </Text>
                <TextInput placeholder='Give your name' style={styles.textinput} value={matchDetails.gameName} onChangeText={(text)=>setMatchDetails((prev)=>({...prev,gameName:text}))}/>
               
            </View>
            <View style={{display:'flex',marginTop:30}}>
                <Text style={{fontSize:20,fontWeight:700}}>
                    Bet amount:
                </Text>
                <TextInput placeholder='Enter the amount'  keyboardType="numeric" style={styles.textinput} value={matchDetails.betAmount} onChangeText={(text)=>setMatchDetails((prev)=>({...prev,betAmount:text}))}/>
            </View>
                  <TouchableOpacity style={styles.button} onPress={sendData}><Text style={{ fontSize: 25,fontWeight:700,color:'white',textAlign:'center',marginTop:6}}>Publish</Text></TouchableOpacity>
                </View>
                </View>
                :
            <View><Text>hello lone wolf</Text></View>
            
        }
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
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(0,18,64)',
      padding: 16,
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
    marginBottom: 20,
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
    width:160,
    marginLeft:10
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
},  modalContainer: {
  flex: 1,
  alignItems: 'center',
// Semi-transparent background
},
modalContent: {
  width: 300,
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
export default ClashSquad