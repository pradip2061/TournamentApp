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
import{BASE_URL} from '../../env'
const ClashSquad = ({ navigation }) => {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [trigger, setTrigger] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const[loading,setLoading]=useState(false)
  const { getdata } = useContext(CheckAdminContext)
  const [matchDetails, setMatchDetails] = useState({
    show: false,
    showDetail: true,
    player: '1v1',
    ammo: 'yes',
    headshot: 'yes',
    skill: 'No',
    round: 13,
    coin: 'Default',
    match: 'clashsquad',
    gameName: '',
    betAmount: '',
  });

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

  const playerOptions = [
    { id: 1, label: "1v1" },
    { id: 2, label: "2v2" },
    { id: 3, label: "3v3" },
    { id: 4, label: "4v4" },
  ];

  const playerOption = [
    { id: 1, label: "1v1" },
    { id: 2, label: "2v2" },
  ];

  const roundOptions = [
    { id: 1, label: 7 },
    { id: 2, label: 9 },
    { id: 3, label: 13 },
  ];

  const coinOptions = [
    { id: 1, label: "Default" },
    { id: 2, label: "9999" },
  ];

  const sendData = async (e) => {
    e.preventDefault()
    try {
      if (!matchDetails.betAmount || !matchDetails.gameName) {
        modal('Fill all fields')
        return
      }
      const token = await AsyncStorage.getItem('token')
      await axios.post(`${BASE_URL}/khelmela/create`, { matchDetails }, {
        headers: {
          Authorization: `${token}`
        }
      })
        .then((response) => {
          modal(response.data.message)
          setTrigger('done')
          setMatchDetails((prev) => ({ ...prev, show: false }))
          matchidSend(response.data.newMatch._id)
        })
    } catch (error) {
      const errorMessage = error.response.data.message || "Exceed the limit";
      modal(errorMessage)
    }
  }

  const matchidSend = async (matchId) => {
    try {
      const token = await AsyncStorage.getItem('token')
      await axios.post(`${BASE_URL}/khelmela/addinhost`, { matchId }, {
        headers: {
          Authorization: `${token}`
        }
      })
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Exceed the limit";
      modal(errorMessage)
    }
  }

  useEffect(() => {
    try {
      setLoading(true)
      const getMatches = async () => {
        await axios.get(`${BASE_URL}/khelmela/get`)
          .then((response) => {
            setData(response.data.card)
          })
      }
      getMatches()
    } catch (error) {
      setMessage(error.response.data.message)
    }finally{
      setLoading(true)
    }
  }, [getdata, trigger])

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

        <View style={{ paddingBottom: 15 }}>
          <View>
            {data.length !== 0 ? (
              <FlatList
                data={data}
                scrollEnabled={false}
                keyExtractor={(item, id) => id.toString()}
                renderItem={({ item }) => <MatchCard match={item} />}
                contentContainerStyle={{ gap: 20 }}
              />
            ) : (
              data === null ||[]?<Text>No Matches Right now.</Text>:
              <ShimmerBox/>
            )}
          </View>
        </View>

        <Modal visible={matchDetails.show} transparent animationType='fade' onRequestClose={handleOutsidePress}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Create Your Match</Text>
            <ScrollView>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={styles.sectionTitle}>Room Mode</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    onPress={() => setMatchDetails((prev) => ({ ...prev, showDetail: true, match: 'clashsquad' }))}
                    style={matchDetails.showDetail ? styles.toggleActive : styles.toggle}
                  >
                    <Text style={matchDetails.showDetail ? styles.toggleTextActive : styles.toggleText}>Clash Squad</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMatchDetails((prev) => ({ ...prev, showDetail: false, coin: '', match: 'loneWolf' }))}
                    style={!matchDetails.showDetail ? styles.toggleActive : styles.toggle}
                  >
                    <Text style={!matchDetails.showDetail ? styles.toggleTextActive : styles.toggleText}>Lone Wolf</Text>
                  </TouchableOpacity>
                </View>

                {matchDetails.showDetail ? (
                  <View style={styles.inputSection}>
                    <Text style={styles.sectionTitle}>Player</Text>
                    <FlatList
                      data={playerOptions}
                      horizontal
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => setMatchDetails((prev) => ({ ...prev, player: item.label }))}
                          style={matchDetails.player === item.label ? styles.optionActive : styles.option}
                        >
                          <Text style={matchDetails.player === item.label ? styles.optionTextActive : styles.optionText}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.optionContainer}
                    />

                    <Text style={styles.sectionTitle}>Limited Ammo</Text>
                    <View style={styles.toggleContainer}>
                      {['yes', 'No'].map((value) => (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setMatchDetails((prev) => ({ ...prev, ammo: value }))}
                          style={matchDetails.ammo === value ? styles.toggleActive : styles.toggle}
                        >
                          <Text style={matchDetails.ammo === value ? styles.toggleTextActive : styles.toggleText}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.sectionTitle}>Headshot</Text>
                    <View style={styles.toggleContainer}>
                      {['yes', 'No'].map((value) => (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setMatchDetails((prev) => ({ ...prev, headshot: value }))}
                          style={matchDetails.headshot === value ? styles.toggleActive : styles.toggle}
                        >
                          <Text style={matchDetails.headshot === value ? styles.toggleTextActive : styles.toggleText}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.sectionTitle}>Character Skill</Text>
                    <View style={styles.toggleContainer}>
                      {['yes', 'No'].map((value) => (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setMatchDetails((prev) => ({ ...prev, skill: value }))}
                          style={matchDetails.skill === value ? styles.toggleActive : styles.toggle}
                        >
                          <Text style={matchDetails.skill === value ? styles.toggleTextActive : styles.toggleText}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.sectionTitle}>Rounds</Text>
                    <FlatList
                      data={roundOptions}
                      horizontal
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => setMatchDetails((prev) => ({ ...prev, round: item.label }))}
                          style={matchDetails.round === item.label ? styles.optionActive : styles.option}
                        >
                          <Text style={matchDetails.round === item.label ? styles.optionTextActive : styles.optionText}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.optionContainer}
                    />

                    <Text style={styles.sectionTitle}>Coin</Text>
                    <FlatList
                      data={coinOptions}
                      horizontal
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => setMatchDetails((prev) => ({ ...prev, coin: item.label }))}
                          style={matchDetails.coin === item.label ? styles.optionActive : styles.option}
                        >
                          <Text style={matchDetails.coin === item.label ? styles.optionTextActive : styles.optionText}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.optionContainer}
                    />

                    <Text style={styles.sectionTitle}>Game Name</Text>
                    <TextInput
                      placeholder='Give your name'
                      style={styles.textInput}
                      value={matchDetails.gameName}
                      onChangeText={(text) => setMatchDetails((prev) => ({ ...prev, gameName: text }))}
                    />
                    
                    <Text style={styles.sectionTitle}>Bet Amount</Text>
                    <TextInput
                      placeholder='Enter the amount'
                      keyboardType="numeric"
                      style={styles.textInput}
                      value={matchDetails.betAmount}
                      onChangeText={(text) => setMatchDetails((prev) => ({ ...prev, betAmount: text }))}
                    />

                    <TouchableOpacity style={styles.publishButton} onPress={sendData}>
                      <Text style={styles.publishButtonText}>Publish</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.inputSection}>
                    <Text style={styles.sectionTitle}>Player</Text>
                    <FlatList
                      data={playerOption}
                      horizontal
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => setMatchDetails((prev) => ({ ...prev, player: item.label }))}
                          style={matchDetails.player === item.label ? styles.optionActive : styles.option}
                        >
                          <Text style={matchDetails.player === item.label ? styles.optionTextActive : styles.optionText}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.optionContainer}
                    />

                    <Text style={styles.sectionTitle}>Limited Ammo</Text>
                    <View style={styles.toggleContainer}>
                      {['yes', 'No'].map((value) => (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setMatchDetails((prev) => ({ ...prev, ammo: value }))}
                          style={matchDetails.ammo === value ? styles.toggleActive : styles.toggle}
                        >
                          <Text style={matchDetails.ammo === value ? styles.toggleTextActive : styles.toggleText}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.sectionTitle}>Headshot</Text>
                    <View style={styles.toggleContainer}>
                      {['yes', 'No'].map((value) => (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setMatchDetails((prev) => ({ ...prev, headshot: value }))}
                          style={matchDetails.headshot === value ? styles.toggleActive : styles.toggle}
                        >
                          <Text style={matchDetails.headshot === value ? styles.toggleTextActive : styles.toggleText}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.sectionTitle}>Character Skill</Text>
                    <View style={styles.toggleContainer}>
                      {['yes', 'No'].map((value) => (
                        <TouchableOpacity
                          key={value}
                          onPress={() => setMatchDetails((prev) => ({ ...prev, skill: value }))}
                          style={matchDetails.skill === value ? styles.toggleActive : styles.toggle}
                        >
                          <Text style={matchDetails.skill === value ? styles.toggleTextActive : styles.toggleText}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.sectionTitle}>Rounds</Text>
                    <FlatList
                      data={roundOptions}
                      horizontal
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => setMatchDetails((prev) => ({ ...prev, round: item.label }))}
                          style={matchDetails.round === item.label ? styles.optionActive : styles.option}
                        >
                          <Text style={matchDetails.round === item.label ? styles.optionTextActive : styles.optionText}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.optionContainer}
                    />

                    <Text style={styles.sectionTitle}>Game Name</Text>
                    <TextInput
                      placeholder='Give your name'
                      style={styles.textInput}
                      value={matchDetails.gameName}
                      onChangeText={(text) => setMatchDetails((prev) => ({ ...prev, gameName: text }))}
                    />

                    <Text style={styles.sectionTitle}>Bet Amount</Text>
                    <TextInput
                      placeholder='Enter the amount'
                      keyboardType="numeric"
                      style={styles.textInput}
                      value={matchDetails.betAmount}
                      onChangeText={(text) => setMatchDetails((prev) => ({ ...prev, betAmount: text }))}
                    />

                    <TouchableOpacity style={styles.publishButton} onPress={sendData}>
                      <Text style={styles.publishButtonText}>Publish</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
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
    borderWidth:1,
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
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  toggle: {
    paddingVertical: 8,
    paddingHorizontal: 20,
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
  optionContainer: {
    gap: 15,
    paddingVertical: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    minWidth: 60,
    alignItems: 'center',
  },
  optionActive: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FF6B00',
    minWidth: 60,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  optionTextActive: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inputSection: {
    marginTop: 20,
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
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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

export default ClashSquad