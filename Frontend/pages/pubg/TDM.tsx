import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckAdminContext } from '../ContextApi/ContextApi';
import TdmCard from '../../components/TdmCard';
import { BASE_URL } from '../../env';
import { useSocket } from '../../SocketContext';

const TDM = ({ navigation }) => {
  const [datas, setDatas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [matchDetails, setMatchDetails] = useState({
    show: false,
    match: '1v1',
    gameName: '',
    betAmount: '',
  });
  const [joinMatch, setJoinMatch] = useState([]);
  
  const { getdata, data, getProfile } = useContext(CheckAdminContext);
  const { renderPage, setRenderPage } = useSocket();

  useEffect(() => {
    setMatchDetails(prev => ({
      ...prev,
      gameName: data?.gameName?.[0]?.pubg || ''
    }));
  }, [data]);

  const showModal = useCallback((msg) => {
    setVisible(true);
    setMessage(String(msg));
    setTimeout(() => {
      setVisible(false);
      setMessage('');
    }, 1000);
  }, []);

  const getToken = async () => await AsyncStorage.getItem('token');

  const getMatches = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/khelmela/gettdm`, {
        headers: { Authorization: token },
      });
      setDatas(response.data.card);
      setJoinMatch(response.data.matchjoin);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  }, []);

  const sendData = async (e) => {
    e.preventDefault();
    const betAmount = parseInt(matchDetails.betAmount, 10);
    
    if (!matchDetails.betAmount || isNaN(betAmount) || betAmount < 10) {
      showModal('Minimum bet amount is 10');
      return;
    }
    if (!matchDetails.gameName) {
      showModal('Please enter game name');
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.post(
        `${BASE_URL}/khelmela/creatematchtdm`,
        { matchDetails },
        { headers: { Authorization: token } }
      );
      
      showModal(response.data.message);
      setMatchDetails(prev => ({ ...prev, show: false }));
      matchidSend(response.data.newMatch._id);
      getMatches();
    } catch (error) {
      showModal(error.response?.data?.message || 'Something went wrong');
    }
  };

  const matchidSend = async (matchId) => {
    try {
      const token = await getToken();
      await axios.post(
        `${BASE_URL}/khelmela/addinhosttdm`,
        { matchId },
        { headers: { Authorization: token } }
      );
    } catch (error) {
      showModal(error.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    getMatches();
  }, [visible, renderPage, getMatches]);

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setMatchDetails(prev => ({ ...prev, show: false }));
  };

  const renderMatchItem = ({ item }) => (
    <TdmCard matches={item} getmatches={getMatches} />
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        <Pressable
          style={styles.createButton}
          onPress={() => setMatchDetails(prev => ({ ...prev, show: true }))}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.createButtonText}>Create</Text>
        </Pressable>

        {joinMatch.length > 0 && (
          <>
            <View style={styles.liveMatches}>
              <Entypo name="game-controller" size={24} color="#333" />
              <Text style={styles.liveMatchesText}>Enroll Matches</Text>
            </View>
            <FlatList
              data={joinMatch}
              renderItem={renderMatchItem}
              keyExtractor={(item, id) => id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContent}
            />
          </>
        )}

        <View style={styles.liveMatches}>
          <Entypo name="game-controller" size={24} color="#333" />
          <Text style={styles.liveMatchesText}>Live Matches</Text>
        </View>

        {datas.length > 0 ? (
          <FlatList
            data={datas}
            renderItem={renderMatchItem}
            keyExtractor={(item, id) => id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={styles.noMatches}>No live matches right now</Text>
        )}

        <Modal
          visible={matchDetails.show}
          transparent
          animationType="fade"
          onRequestClose={handleOutsidePress}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleOutsidePress}
          >
            <ScrollView style={styles.modal}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleOutsidePress}
              >
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
              
              <Text style={styles.modalTitle}>Create Your Match</Text>
              
              <View style={styles.modalContent}>
                <Text style={styles.sectionTitle}>Room Mode</Text>
                <View style={styles.toggleContainer}>
                  {['1v1', '2v2', '3v3', '4v4'].map(mode => (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => setMatchDetails(prev => ({ ...prev, match: mode }))}
                      style={matchDetails.match === mode ? styles.toggleActive : styles.toggle}
                    >
                      <Text style={matchDetails.match === mode ? styles.toggleTextActive : styles.toggleText}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>Game Name</Text>
                <TextInput
                  placeholder="Enter game name"
                  style={styles.textInput}
                  value={matchDetails.gameName}
                  onChangeText={text => setMatchDetails(prev => ({ ...prev, gameName: text }))}
                />

                <Text style={styles.sectionTitle}>Entry Fee</Text>
                <TextInput
                  placeholder="Enter the amount (min 10)"
                  keyboardType="numeric"
                  style={styles.textInput}
                  value={matchDetails.betAmount}
                  onChangeText={text => setMatchDetails(prev => ({ ...prev, betAmount: text.replace(/[^0-9]/g, '') }))}
                />

                <TouchableOpacity style={styles.publishButton} onPress={sendData}>
                  <Text style={styles.publishButtonText}>Publish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Modal>

        <Modal animationType="fade" transparent visible={visible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalMessageContainer}>
              <Text style={styles.modalMessage}>{message}</Text>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 100 },
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginHorizontal: 10, fontSize: 16, color: '#333' },
  note: { color: '#555', fontSize: 14, marginBottom: 20, marginLeft: 15, fontStyle: 'italic' },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  createButtonText: { marginLeft: 8, fontWeight: '700', color: '#FFFFFF', fontSize: 16 },
  liveMatches: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginVertical: 15,
  },
  liveMatchesText: { marginLeft: 8, fontWeight: '600', color: '#333', fontSize: 16 },
  flatListContent: { gap: 20 },
  noMatches: { textAlign: 'center', marginTop: 100, color: '#666' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalContent: { padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginVertical: 20, color: '#333' },
  closeButton: { position: 'absolute', right: 15, top: 15, padding: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 5 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  toggle: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#F0F0F0' },
  toggleActive: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#FF6B00' },
  toggleText: { fontSize: 16, color: '#666' },
  toggleTextActive: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },
  textInput: {
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
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  publishButtonText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalMessageContainer: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 15 },
  modalMessage: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center' },
});

export default TDM;