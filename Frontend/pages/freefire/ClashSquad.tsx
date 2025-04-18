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
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MatchCard from '../../components/MatchCard';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckAdminContext } from '../ContextApi/ContextApi';
import { BASE_URL } from '../../env';
import { useSocket } from '../../SocketContext';

const ClashSquad = ({ navigation }) => {
  const [datas, setDatas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { getProfile, data } = useContext(CheckAdminContext);
  const [joinMatch, setJoinMatch] = useState([]);
  const { renderPage } = useSocket();
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
    gameName: data?.gameName?.[0]?.freefire || '',
    betAmount: '',
  });

  const modal = messages => {
    setVisible(true);
    setMessage(String(messages));
    setTimeout(() => {
      setVisible(false);
      setMessage('');
    }, 1000);
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setMatchDetails(prev => ({ ...prev, show: false }));
  };

  const playerOptions = [
    { id: 1, label: '1v1' },
    { id: 2, label: '2v2' },
    { id: 3, label: '3v3' },
    { id: 4, label: '4v4' },
  ];

  const playerOption = [
    { id: 1, label: '1v1' },
    { id: 2, label: '2v2' },
  ];

  const roundOptions = [
    { id: 1, label: 7 },
    { id: 2, label: 9 },
    { id: 3, label: 13 },
  ];

  const coinOptions = [
    { id: 1, label: 'Default' },
    { id: 2, label: '9999' },
  ];

  const sendData = async e => {
    e.preventDefault();
    try {
      const betAmountNum = parseInt(matchDetails.betAmount, 10);
      if (!matchDetails.betAmount || isNaN(betAmountNum) || betAmountNum <= 9) {
        modal('Bet amount cannot be less 10 ');
        return;
      }
      if (!matchDetails.gameName) {
        modal('Please enter a game name');
        return;
      }
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/create`,
        { matchDetails },
        { headers: { Authorization: `${token}` } }
      );
      modal(response.data.message);
      setMatchDetails(prev => ({ ...prev, show: false }));
      matchidSend(response.data.newMatch._id);
      getMatches();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Exceed the limit';
      modal(errorMessage);
    }
  };

  const matchidSend = async matchId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/khelmela/addinhost`,
        { matchId },
        { headers: { Authorization: `${token}` } }
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Exceed the limit';
      modal(errorMessage);
    }
  };

  const getMatches = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/khelmela/get`, {
        headers: { Authorization: `${token}` },
      });
      setDatas(response.data.card || []);
      setJoinMatch(response.data.matchjoin || []);
    } catch (error) {
      modal('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatches();
  }, [renderPage]);

  const refreshData = () => {
    getMatches();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="menu-outline" size={24} color="#333" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your match"
            placeholderTextColor="#808080"
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

       (
          <>
            {/* Enroll Matches (Shown only if joined) */}
            {joinMatch.length > 0 && (
              <View>
                <View style={styles.liveMatches}>
                  <Entypo name="game-controller" size={24} color="#333" />
                  <Text style={styles.liveMatchesText}>Enroll Matches</Text>
                </View>
                <FlatList
                  data={joinMatch}
                  scrollEnabled={false}
                  keyExtractor={(item, id) => id.toString()}
                  renderItem={({ item }) => (
                    <MatchCard match={item} refreshData={refreshData} />
                  )}
                  contentContainerStyle={{ gap: 20 }}
                />
              </View>
            )}

            {/* Live Matches (Always shown) */}
            <View style={styles.liveMatches}>
              <Entypo name="game-controller" size={24} color="#333" />
              <Text style={styles.liveMatchesText}>Live Matches</Text>
            </View>
            {datas.length > 0 ? (
              <FlatList
                data={datas}
                scrollEnabled={false}
                keyExtractor={(item, id) => id.toString()}
                renderItem={({ item }) => (
                  <MatchCard match={item} refreshData={refreshData} />
                )}
                contentContainerStyle={{ gap: 20 }}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 100,
                  fontSize: 15,
                  color: '#333',
                }}
              >
                No Matches Right now.
              </Text>
            )}
          </>
        )}

        <Modal
          visible={matchDetails.show}
          transparent
          animationType="fade"
          onRequestClose={handleOutsidePress}
        >
          <ScrollView
            contentContainerStyle={styles.modalContentContainer}
            nestedScrollEnabled={true}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={handleOutsidePress}
            >
              <TouchableOpacity style={styles.modal} activeOpacity={1}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleOutsidePress}
                >
                  <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Create Your Match</Text>
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={styles.sectionTitle}>Room Mode</Text>
                  <View style={styles.toggleContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        setMatchDetails(prev => ({
                          ...prev,
                          showDetail: true,
                          match: 'clashsquad',
                        }))
                      }
                      style={
                        matchDetails.showDetail
                          ? styles.toggleActive
                          : styles.toggle
                      }
                    >
                      <Text
                        style={
                          matchDetails.showDetail
                            ? styles.toggleTextActive
                            : styles.toggleText
                        }
                      >
                        Clash Squad
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        setMatchDetails(prev => ({
                          ...prev,
                          showDetail: false,
                          coin: '',
                          match: 'loneWolf',
                        }))
                      }
                      style={
                        !matchDetails.showDetail
                          ? styles.toggleActive
                          : styles.toggle
                      }
                    >
                      <Text
                        style={
                          !matchDetails.showDetail
                            ? styles.toggleTextActive
                            : styles.toggleText
                        }
                      >
                        Lone Wolf
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {matchDetails.showDetail ? (
                    <View style={styles.inputSection}>
                      <Text style={styles.sectionTitle}>Player</Text>
                      <FlatList
                        data={playerOptions}
                        horizontal
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                player: item.label,
                              }))
                            }
                            style={
                              matchDetails.player === item.label
                                ? styles.optionActive
                                : styles.option
                            }
                          >
                            <Text
                              style={
                                matchDetails.player === item.label
                                  ? styles.optionTextActive
                                  : styles.optionText
                              }
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.optionContainer}
                      />

                      <Text style={styles.sectionTitle}>Limited Ammo</Text>
                      <View style={styles.toggleContainer}>
                        {['yes', 'No'].map(value => (
                          <TouchableOpacity
                            key={value}
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                ammo: value,
                              }))
                            }
                            style={
                              matchDetails.ammo === value
                                ? styles.toggleActive
                                : styles.toggle
                            }
                          >
                            <Text
                              style={
                                matchDetails.ammo === value
                                  ? styles.toggleTextActive
                                  : styles.toggleText
                              }
                            >
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={styles.sectionTitle}>Headshot</Text>
                      <View style={styles.toggleContainer}>
                        {['yes', 'No'].map(value => (
                          <TouchableOpacity
                            key={value}
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                headshot: value,
                              }))
                            }
                            style={
                              matchDetails.headshot === value
                                ? styles.toggleActive
                                : styles.toggle
                            }
                          >
                            <Text
                              style={
                                matchDetails.headshot === value
                                  ? styles.toggleTextActive
                                  : styles.toggleText
                              }
                            >
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={styles.sectionTitle}>Character Skill</Text>
                      <View style={styles.toggleContainer}>
                        {['yes', 'No'].map(value => (
                          <TouchableOpacity
                            key={value}
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                skill: value,
                              }))
                            }
                            style={
                              matchDetails.skill === value
                                ? styles.toggleActive
                                : styles.toggle
                            }
                          >
                            <Text
                              style={
                                matchDetails.skill === value
                                  ? styles.toggleTextActive
                                  : styles.toggleText
                              }
                            >
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={styles.sectionTitle}>Rounds</Text>
                      <FlatList
                        data={roundOptions}
                        horizontal
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                round: item.label,
                              }))
                            }
                            style={
                              matchDetails.round === item.label
                                ? styles.optionActive
                                : styles.option
                            }
                          >
                            <Text
                              style={
                                matchDetails.round === item.label
                                  ? styles.optionTextActive
                                  : styles.optionText
                              }
                            >
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
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                coin: item.label,
                              }))
                            }
                            style={
                              matchDetails.coin === item.label
                                ? styles.optionActive
                                : styles.option
                            }
                          >
                            <Text
                              style={
                                matchDetails.coin === item.label
                                  ? styles.optionTextActive
                                  : styles.optionText
                              }
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.optionContainer}
                      />

                      <Text style={styles.sectionTitle}>Game Name</Text>
                      <TextInput
                        placeholder="Give your name"
                        style={styles.textInput}
                        value={matchDetails.gameName}
                        onChangeText={text =>
                          setMatchDetails(prev => ({ ...prev, gameName: text }))
                        }
                        placeholderTextColor="#808080"
                      />

                      <Text style={styles.sectionTitle}>Bet Amount</Text>
                      <TextInput
                        placeholder="Enter the amount (min 10)"
                        keyboardType="numeric"
                        style={styles.textInput}
                        value={matchDetails.betAmount}
                        onChangeText={text => {
                          const numericValue = text.replace(/[^0-9]/g, '');
                          setMatchDetails(prev => ({
                            ...prev,
                            betAmount: numericValue,
                          }));
                        }}
                        placeholderTextColor="#808080"
                      />

                      <TouchableOpacity
                        style={styles.publishButton}
                        onPress={sendData}
                      >
                        <Text style={styles.publishButtonText}>Publish</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.inputSection}>
                      <Text style={styles.sectionTitle}>Player</Text>
                      <FlatList
                        data={playerOption}
                        horizontal
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                player: item.label,
                              }))
                            }
                            style={
                              matchDetails.player === item.label
                                ? styles.optionActive
                                : styles.option
                            }
                          >
                            <Text
                              style={
                                matchDetails.player === item.label
                                  ? styles.optionTextActive
                                  : styles.optionText
                              }
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.optionContainer}
                      />

                      <Text style={styles.sectionTitle}>Limited Ammo</Text>
                      <View style={styles.toggleContainer}>
                        {['yes', 'No'].map(value => (
                          <TouchableOpacity
                            key={value}
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                ammo: value,
                              }))
                            }
                            style={
                              matchDetails.ammo === value
                                ? styles.toggleActive
                                : styles.toggle
                            }
                          >
                            <Text
                              style={
                                matchDetails.ammo === value
                                  ? styles.toggleTextActive
                                  : styles.toggleText
                              }
                            >
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={styles.sectionTitle}>Headshot</Text>
                      <View style={styles.toggleContainer}>
                        {['yes', 'No'].map(value => (
                          <TouchableOpacity
                            key={value}
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                headshot: value,
                              }))
                            }
                            style={
                              matchDetails.headshot === value
                                ? styles.toggleActive
                                : styles.toggle
                            }
                          >
                            <Text
                              style={
                                matchDetails.headshot === value
                                  ? styles.toggleTextActive
                                  : styles.toggleText
                              }
                            >
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={styles.sectionTitle}>Character Skill</Text>
                      <View style={styles.toggleContainer}>
                        {['yes', 'No'].map(value => (
                          <TouchableOpacity
                            key={value}
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                skill: value,
                              }))
                            }
                            style={
                              matchDetails.skill === value
                                ? styles.toggleActive
                                : styles.toggle
                            }
                          >
                            <Text
                              style={
                                matchDetails.skill === value
                                  ? styles.toggleTextActive
                                  : styles.toggleText
                              }
                            >
                              {value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={styles.sectionTitle}>Rounds</Text>
                      <FlatList
                        data={roundOptions}
                        horizontal
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() =>
                              setMatchDetails(prev => ({
                                ...prev,
                                round: item.label,
                              }))
                            }
                            style={
                              matchDetails.round === item.label
                                ? styles.optionActive
                                : styles.option
                            }
                          >
                            <Text
                              style={
                                matchDetails.round === item.label
                                  ? styles.optionTextActive
                                  : styles.optionText
                              }
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.optionContainer}
                      />

                      <Text style={styles.sectionTitle}>Game Name</Text>
                      <TextInput
                        placeholder="Give your name"
                        style={styles.textInput}
                        value={matchDetails.gameName}
                        onChangeText={text =>
                          setMatchDetails(prev => ({ ...prev, gameName: text }))
                        }
                        placeholderTextColor="#808080"
                      />

                      <Text style={styles.sectionTitle}>Bet Amount</Text>
                      <TextInput
                        placeholder="Enter the amount (min 10)"
                        keyboardType="numeric"
                        style={styles.textInput}
                        value={matchDetails.betAmount}
                        onChangeText={text => {
                          const numericValue = text.replace(/[^0-9]/g, '');
                          setMatchDetails(prev => ({
                            ...prev,
                            betAmount: numericValue,
                          }));
                        }}
                        placeholderTextColor="#808080"
                      />

                      <TouchableOpacity
                        style={styles.publishButton}
                        onPress={sendData}
                      >
                        <Text style={styles.publishButtonText}>Publish</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </ScrollView>
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
  );
};

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
  },
  modal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    marginTop: 280,
    zIndex: 100,
  },
  modalContentContainer: {
    paddingBottom: 10,
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
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
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
});

export default ClashSquad;