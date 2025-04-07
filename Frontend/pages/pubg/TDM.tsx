import { View, Text, StyleSheet, Pressable, TextInput, Modal, Keyboard, TouchableOpacity, ScrollView, Animated } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import MatchCard from '../../components/MatchCard'
import { FlatList } from 'react-native-gesture-handler'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ShimmerBox from '../../components/ShimmerBox'
import { CheckAdminContext } from '../ContextApi/ContextApi'
import TdmCard from '../../components/TdmCard'
import { BASE_URL } from '../../env'

const TDM = ({ navigation }) => {
  const [datas, setDatas] = useState([])
  const [trigger, setTrigger] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const { getdata, data, getProfile } = useContext(CheckAdminContext)
  const [matchDetails, setMatchDetails] = useState({
    show: false,
    showDetail: true,
    match: '1v1',
    gameName: data?.gameName?.[0]?.pubg || '',
    betAmount: '',
  });
    const[joinMatch,setJoinMatch]=useState([])

  console.log(matchDetails.match)
  
  const modal = (messages) => {
    setVisible(true)
    setMessage(String(messages))
    setTimeout(() => {
      setVisible(false)
      setMessage('')
    }, 1000)
  }

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setMatchDetails((prev) => ({ ...prev, show: false }));
  }

  const handleModalContentPress = (e) => {
    e.stopPropagation();
  }

  const sendData = async (e) => {
    e.preventDefault()
    try {
      if (!matchDetails.betAmount || !matchDetails.gameName) {
        modal('Fill all fields')
        return
      }
      const token = await AsyncStorage.getItem('token')
      await axios.post(`${BASE_URL}/khelmela/creatematchtdm`, { matchDetails }, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then((response) => {
        console.log(response)
        modal(response.data.message)
        setTrigger('done')
        setMatchDetails((prev) => ({ ...prev, show: false }))
        matchidSend(response.data.newMatch._id)
      })
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Exceed the limit";
      modal(errorMessage)
    }
  }

  const matchidSend = async (matchId) => {
    console.log(matchId)
    try {
      const token = await AsyncStorage.getItem('token')
      await axios.post(`${BASE_URL}/khelmela/addinhosttdm`, { matchId }, {
        headers: {
          Authorization: `${token}`
        }
      })
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Exceed the limit";
      modal(errorMessage)
    }
  }

  const getMatches = async () => {
    const token=await AsyncStorage.getItem('token')
    await axios.get(`${BASE_URL}/khelmela/gettdm`,{
      headers:{
        Authorization:`${token}`
      }
    }).then(response => {
      setDatas(response.data.card);
      setJoinMatch(response.data.matchjoin)
      console.log(response)
    });
  };

useEffect(()=>{
  getMatches();
},[message])



  const triggergettdm =()=>{
    getMatches()
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="menu-outline" size={24} color="#333" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your match"
            placeholderTextColor="#666"
          />
          <FontAwesome5 name="search" size={20} color="#333" />
        </View>

        <Text style={styles.note}>
          Note: All matches are made by host player not admin
        </Text>

        <Pressable style={styles.createButton} onPress={() => setMatchDetails((prev) => ({ ...prev, show: true }))}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.createButtonText}>Create</Text>
        </Pressable>

        <View style={styles.liveMatches}>
          <Entypo name="game-controller" size={24} color="#333" />
          <Text style={styles.liveMatchesText}>Live Matches</Text>
        </View>
        <View style={{backgroundColor:'red'}}>
        { joinMatch?.length !== 0 ? (
      <FlatList
        data={joinMatch}
        scrollEnabled={false}
        keyExtractor={(item, id) => id.toString()}
        renderItem={({ item }) => (
          <TdmCard matches={item} getmatches={triggergettdm}/>
        )}
        contentContainerStyle={{ gap: 20 }}
      />
    ) : (
      <Text>No join Matches Right now.</Text>
    )}
        </View>
        <View style={{ paddingBottom: 300 }}>
          <View>
            {datas?.length ? (
              <FlatList
                data={datas}
                scrollEnabled={false}
                keyExtractor={(item, id) => id.toString()}
                renderItem={({ item }) => <TdmCard matches={item} getmatches={triggergettdm}/>}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              />
            ) : (
              data === null || data?.length === 0 ? <Text>No Matches Right now.</Text> :
              <ShimmerBox/>
            )}
          </View>
        </View>

        <Modal
          visible={matchDetails.show}
          transparent
          animationType='fade'
          onRequestClose={handleOutsidePress}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleOutsidePress}
          >
            <View 
              style={styles.modal}
              onStartShouldSetResponder={() => true}
              onResponderGrant={handleModalContentPress}
            >
              <ScrollView 
                style={styles.modalScroll}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={true}
              >
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={handleOutsidePress}
                >
                  <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
                
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Create Your Match</Text>
                <View style={{ marginHorizontal: 15 }}>
                  <Text style={styles.sectionTitle}>Room Mode</Text>
                  <View style={styles.toggleContainer}>
                    {['1v1', '2v2', '3v3', '4v4'].map((mode) => (
                      <TouchableOpacity
                        key={mode}
                        onPress={() => setMatchDetails((prev) => ({ ...prev, match: mode }))}
                        style={matchDetails.match === mode ? styles.toggleActive : styles.toggle}
                      >
                        <Text style={matchDetails.match === mode ? styles.toggleTextActive : styles.toggleText}>
                          {mode}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.inputSection}>
                    <Text style={styles.sectionTitle}>Game Name</Text>
                    <TextInput
                      placeholder='Enter game name'
                      style={styles.textInput}
                      value={matchDetails.gameName}
                      onChangeText={(text) => setMatchDetails((prev) => ({ ...prev, gameName: text }))}
                    />

                    <Text style={styles.sectionTitle}>Entry Fee</Text>
                    <TextInput
                      placeholder='Enter amount'
                      keyboardType="numeric"
                      style={styles.textInput}
                      value={matchDetails.betAmount}
                      onChangeText={(text) => setMatchDetails((prev) => ({ ...prev, betAmount: text }))}
                    />

                    <TouchableOpacity style={styles.publishButton} onPress={sendData}>
                      <Text style={styles.publishButtonText}>Publish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={visible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>{message}</Text>
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
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  note: {
    color: '#555',
    fontSize: 14,
    marginBottom: 20,
    marginLeft: 15,
    fontStyle: 'italic',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonText: {
    marginLeft: 8,
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 16,
  },
  liveMatches: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  liveMatchesText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  modal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: -70,
  },
  modalScroll: {
    width: '100%',
  },
  modalContentContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    
  },
  toggle: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  toggleActive: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FF6B00',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputSection: {
    marginTop: 1,
  },
  textInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  publishButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  publishButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
})

export default TDM