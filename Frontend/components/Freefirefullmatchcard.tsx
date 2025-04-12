import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import ModalNotify from './ModalNotify';
import LinearGradient from 'react-native-linear-gradient';
import { CheckAdminContext } from '../pages/ContextApi/ContextApi';
import { BASE_URL } from '../env';

const freefire = require('../assets/freefire.jpeg');
const bermuda = require('../assets/bermuda.jpg');
const purgatory = require('../assets/pugatory.png');
const kalahari = require('../assets/kalahari.webp');

const Freefirefullmatchcard = ({ matches }) => {
  const { setTrigger, data } = useContext(CheckAdminContext);
  const [joinModel, setJoinModel] = useState(false);
  const [rulesModel, setRulesModel] = useState(false); // New state for rules modal
  const [checKJoined, setCheckJoined] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [player1] = useState(data?.gameName?.[0]?.freefire || '');
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const [player4, setPlayer4] = useState('');
    const[reportplayer,setReportPlayer]=useState(false)
  const[reportplayerModel,setReportPlayerModel]=useState(false)
  const[userid,setUserid]=useState("")
  const[loading,setLoading]=useState(false)
  const matchId = matches._id;
  const isSquad = matches.playermode === 'Squad';
  const maxSlots = isSquad ? 16 : 48;

  const notify = () => {
    setJoinModel(false);
    setVisible(true);
    setTimeout(() => setVisible(false), 900);
  };

  useEffect(() => {
    const getName = () => {
      const Name = matches.gameName.filter(item => item.userid === data._id);
      setPlayer2(Name?.[0]?.player2 || '');
      setPlayer3(Name?.[0]?.player3 || '');
      setPlayer4(Name?.[0]?.player4 || '');
    };
    getName();
  }, [matches.gameName, data._id]);

  const joinuser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (matches.TotalPlayer >= maxSlots) {
        setMessage('Slot is full!');
        return;
      }
      await axios.post(
        `${BASE_URL}/khelmela/joinff`,
        { matchId },
        { headers: { Authorization: `${token}` } }
      ).then(response => {
        setMessage(response.data.message);
        setTrigger('done');
      });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkuser = async () => {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/khelmela/checkuserff`,
        { matchId },
        { headers: { Authorization: `${token}` } }
      ).then(response => {
        if (response.status === 200) {
          setCheckJoined(response.data.message);
        }
      });
    };
    checkuser();
  }, [matchId]);

  const clipboardid = () => Clipboard.setString('855545895');
  const clipboardpass = () => Clipboard.setString('5498');

  const addName = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(
        `${BASE_URL}/khelmela/addNameff`,
        { matchId, player1, player2, player3, player4 },
        { headers: { Authorization: `${token}` } }
      ).then(response => setMessage(response.data.message));
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };
 const honorScore=async()=>{
    try {
      setLoading(true)
      setError("")
      setMessage("")
      if(!userid){
        return
      }
      const response =await axios.post(`${BASE_URL}/khelmela/honorscore`,{userid})
      if(response.status === 200){
        setMessage(response.data.message)
      }
    } catch (error) {
      setError(error.response.data.message)
    }finally{
      notify()
      setLoading(false)
    }
  }
  const reportplayers=(userid)=>{
    setReportPlayerModel(true)
    setUserid(userid)
  }
  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
      key={matches._id}
    >
      {/* Existing Code */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={freefire} style={styles.image} />
          <Text style={styles.text}>Freefire Full Match</Text>
        </View>
        <Text style={styles.text}>Player mode: {matches.playermode}</Text>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.title}>MAP: Random</Text>
        <Text style={styles.title}>Total slot: {maxSlots}</Text>
      </View>

      <View style={styles.mapImages}>
        <Image source={bermuda} style={styles.imagemap} />
        <Image source={purgatory} style={styles.imagemap} />
        <Image source={kalahari} style={styles.imagemap} />
      </View>

      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.text}>Winner:</Text>
          <Text style={styles.text}>{isSquad ? 'Top: 1' : 'Top: 3'}</Text>
          <Text style={styles.text}>{isSquad ? 'Top: 3' : 'Top: 16'}</Text>
        </View>
        <View>
          <Text style={styles.text}>Odds:</Text>
          <Text style={styles.text}>3x</Text>
          <Text style={styles.text}>2x</Text>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.timeAndEntryContainer}>
        <View style={styles.timeContainer}>
          <Text style={{ marginLeft: 5 }}>Time: {matches.time || '9:00 AM'}</Text>
          {checKJoined === 'notjoined' ? (
            <TouchableOpacity
              style={styles.entryButton}
              onPress={() => setJoinModel(true)}
            >
              <Text style={{ color: 'white' }}>Entry fee: {matches.entryFee}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.joinedButton}>
              <Text style={{ color: 'white' }}>Joined</Text>
            </View>
          )}
        </View>
      </View>

      {/* Updated Note TouchableOpacity */}
      <TouchableOpacity onPress={() => setRulesModel(true)}>
        <Text style={styles.noteText}>
          Note: Click Here to see rules of the full map
        </Text>
      </TouchableOpacity>

      {/* Existing Join Modal */}
      <Modal transparent animationType="slide" visible={joinModel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to join this match?</Text>
            <Text style={styles.smallText}>
              Rs {matches.entryFee} will be deducted from your account.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={() => setJoinModel(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.yesButton]}
                onPress={joinuser}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Rules Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={rulesModel}
        onRequestClose={() => setRulesModel(false)}
      >
        <View style={styles.rulesModalContainer}>
          <View style={styles.rulesModalContent}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.rulesTitle}>Rules of the Full Map Match</Text>
              <Text style={styles.rulesText}>
                1️⃣. All players are compulsory to follow the rules while playing full match. Any player found violating the rules will be immediately disqualified from the match.
              </Text>
              <Text style={styles.rulesText}>
                1.1 If match was cancelled due to technical issues or some reason, players will get mail on notification and money will refund.
              </Text>
            
              <Text style={styles.rulesText}>
                2️⃣. If the match does not reach 48 players, the number of winners will decrease accordingly. The top 35% of total players will receive the prize. Example: If there are 40 players, only the top 14 players will receive the prize. same goes for  Squad also 35%.
              </Text>
              <Text style={styles.rulesText}>
                3️⃣. The prize distribution will be as follows:
                {"\n    "}* In solo the top 16 players & in Squad top 3   will receive a 2x prize.
                {"\n    "}* In solo the top 3 players & in Squad top 1 will receive a 3x prize.
                {"\n      "}Example of odds: 2x means you get 2 times your entry fee, and 3x means you get 3 times your entry fee.
              </Text>
              
              <Text style={styles.rulesText}>
                4️⃣.  Using any kind of bug, hacking, or team up activity is strictly prohibited.
                
              </Text>
              <Text style={styles.rulesText}>
                5️⃣.Full map matches are non-refundable if a player failed to  join match in given time.
                {"\n    "}Password will given before 6 min of match time.
                {"\n    "}Match will be started after 2 min of match time. so player have total 8 min to join the match.

              </Text>
              <Text style={styles.rulesText}>
                6️⃣. ID and Password will be given to player before 6 min by notification of the app or player can also see the id and pass from the enroll match.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setRulesModel(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ModalNotify visible={visible} error={error} message={message} />

      {/* Existing Joined Section */}
      {checKJoined === 'joined' && (
        <View style={styles.joinedContainer}>
          <View style={styles.playerContainer}>
            {matches.playermode === 'Squad' ? (
              <>
                <Text style={styles.squadHeaderText}>
                  Enter Your Squad Member Game Names
                </Text>
                <View style={styles.Row}>
                  <View style={styles.mainplayerbox}>
                    <Text style={styles.mainPlayerText}>{player1}</Text>
                  </View>
                  <TouchableOpacity style={styles.add} onPress={addName}>
                    <Text style={{ color: 'black', fontSize: 15, fontWeight: '700' }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.squadInputRow}>
                    <TextInput
                      style={styles.squadInput}
                      placeholder="Player 2"
                      value={player2}
                      onChangeText={text => setPlayer2(text)}
                      placeholderTextColor="grey"
                      textAlign="center"
                    />
                    <TextInput
                      style={styles.squadInput}
                      placeholder="Player 3"
                      value={player3}
                      onChangeText={text => setPlayer3(text)}
                      placeholderTextColor="#aaa"
                      textAlign="center"
                    />
                    <TextInput
                      style={styles.squadInput}
                      placeholder="Player 4"
                      value={player4}
                      onChangeText={text => setPlayer4(text)}
                      placeholderTextColor="#aaa"
                      textAlign="center"
                    />
                  </View>
                  <Text style={styles.roomInfoText}>
                    Room id & pass will be shown before 6 min of matchtime
                  </Text>
                  <View style={styles.clip}>
                    <View style={styles.input}>
                      <Text>Custom Id: 855545895</Text>
                      <TouchableOpacity onPress={clipboardid}>
                        <AntDesign name="copy1" size={17} style={{ marginLeft: 10 }} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.input}>
                      <Text>Pass: 5498</Text>
                      <TouchableOpacity onPress={clipboardpass}>
                        <AntDesign name="copy1" size={17} style={{ marginLeft: 10 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={()=>setReportPlayer(true)}>
                      <Text>report the player</Text>
                    </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.roomInfoText}>
                  Room id & pass will be shown before 6 min of matchtime
                </Text>
                <View style={styles.clip}>
                  <View style={styles.input}>
                    <Text>Custom Id: 855545895</Text>
                    <TouchableOpacity onPress={clipboardid}>
                      <AntDesign name="copy1" size={17} style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.input}>
                    <Text>Pass: 5498</Text>
                    <TouchableOpacity onPress={clipboardpass}>
                      <AntDesign name="copy1" size={17} style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={()=>setReportPlayer(true)}>
                      <Text>report the player</Text>
                    </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
      <Modal transparent animationType="slide" visible={reportplayer}>
        <View style={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
        <View style={{width:'100%',height:"50%",backgroundColor:'white',marginTop:400}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center',alignItems:"center"}}>
            <View>
            <Text style={styles.modalText}>Report Player</Text>
                <TouchableOpacity
                  onPress={() => setReportPlayer(false)}
                  style={styles.closeButton}>
                  <Text>X</Text>
                  {
                  matches.playermode === 'Squad'?
                  <View style={{gap:20,marginTop:20}}>
                    {
                      matches.gameName.map((item)=>(
                        <View key={item._id} style={{flexDirection:'row',alignItems:'center',gap:30}}>
                          <View>
                          <Text>{item.player1}</Text>
                          <Text>{item.player2 || "player2 Name Unknown"}</Text>
                          <Text>{item.player3||"player3 Name Unknown"}</Text>
                          <Text>{item.player4||"player4 Name Unknown"}</Text>
                          </View>
                          <TouchableOpacity style={{width:40,height:30,backgroundColor:"gray",alignItems:'center',justifyContent:'center'}} onPress={()=>reportplayers(item.userid)}>
                            <Text style={{color:'white'}}>+</Text>
                          </TouchableOpacity>
                          </View>
                      ))
                    }
                  </View>:<View style={{gap:20,marginTop:20}}>
                    {
                      matches.gameName.map((item)=>(
                        <View key={item._id} style={{flexDirection:'row',alignItems:'center',gap:30}}>
                          <View>
                          <Text>{item.player1}</Text>
                          </View>
                          <TouchableOpacity style={{width:40,height:30,backgroundColor:"gray",alignItems:'center',justifyContent:'center'}} onPress={()=>reportplayers(item.userid)}>
                            <Text style={{color:'white'}}>+</Text>
                          </TouchableOpacity>
                          </View>
                      ))
                    }
                  </View>
                  }
                </TouchableOpacity>
            </View>
          </ScrollView>
          </View>
          </View>
      </Modal>
      <Modal transparent animationType="slide" visible={reportplayerModel}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            <View style={styles.modalContent}>
              <View >
                <Text style={styles.modalText}>Report player</Text>
                <TouchableOpacity
                  onPress={() => setReportPlayerModel(false)}
                  style={styles.closeButton}>
                  <Text>X</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.noButton]}
                  onPress={() => setReportPlayerModel(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.yesButton]}
                   onPress={honorScore} disabled={loading}>
                  <Text style={styles.buttonText}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
      </Modal>
    </LinearGradient>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  // Existing styles remain unchanged
  container: {
    width: 340,
    marginLeft: 20,
    padding: 10,
    gap: 15,
    borderRadius: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginLeft: -10,
  },
  text: {
    fontSize: 13.6,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  mapContainer: {
    flexDirection: 'row',
    gap: 120,
    marginLeft: 15,
    marginTop: -10,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  mapImages: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -4,
  },
  imagemap: {
    width: 100,
    height: 80,
    borderRadius: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 76,
    alignItems: 'center',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: -10,
    width: '100%',
  },
  timeAndEntryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  timeContainer: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 25,
    width: 110,
    height: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 105,
  },
  joinedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    height: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
  },
  playerContainer: {
    alignItems: 'center',
  },
  squadHeaderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  squadInputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
    marginTop: 10,
    marginBottom: 5,
  },
  squadInput: {
    width: 90,
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor: 'white',
    fontSize: 12,
  },
  Row: {
    flexDirection: 'row',
    marginLeft: 110,
    gap: 50,
  },
  add: {
    backgroundColor: 'skyblue',
    height: 30,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 5,
  },
  mainPlayerText: {
    width: 90,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: 'bold',
    fontSize: 15,
  },
  clip: {
    flexDirection: 'row',
    gap: 10,
  },
  mainplayerbox: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  joinedButton: {
    backgroundColor: 'green',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  entryButton: {
    backgroundColor: 'green',
    height: 30,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 330,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  smallText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  noButton: {
    backgroundColor: '#dc3545',
  },
  yesButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roomInfoText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '900',
  },
  noteText: {
    color: '#CA0909',
    fontSize: 14.5,
    marginLeft: 10,
    marginTop: -10,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
    textDecorationColor: '#ff4444',
  },
  // New styles for Rules Modal
  rulesModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rulesModalContent: {
    backgroundColor: '#fff',
    height: '70%', // Adjust height as needed
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  rulesText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  rulesNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#CA0909',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }, 
});

export default Freefirefullmatchcard;
