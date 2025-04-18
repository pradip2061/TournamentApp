import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalNotify from './ModalNotify';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_URL} from '../env';
import {CheckAdminContext} from '../pages/ContextApi/ContextApi';
import {launchImageLibrary} from 'react-native-image-picker';

const img = require('../assets/image.png');
const miramar = require('../assets/miramar.jpg');
const erangle = require('../assets/erangle.jpg');
const sanhok = require('../assets/sanhok.jpg');

const PubgFullMatchCard = ({matches}) => {
  const [modal, setModal] = useState(false);
  const {data} = useContext(CheckAdminContext);
  const matchId = matches._id;
  const [notifyModel, setNotifyModel] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rulesMoel, setRulesModel] = useState(false);
  const [checkJoined, setCheckJoined] = useState('');
  const [player1] = useState(data?.gameName?.[0]?.pubg || '');
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const [player4, setPlayer4] = useState('');
  const [checkmatch, setCheckMatch] = useState('');
  const [reportModel, setReportModel] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [reportImage, setReportImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const[reportplayer,setReportPlayer]=useState(false)
  const[reportplayerModel,setReportPlayerModel]=useState(false)
  const[userid,setUserid]=useState("");
  const isSolo = matches.playermode ==='Solo';
  const maxSlots = isSolo ? 64 : 16;
  
 

  const notify = () => {
    setModal(false);
    setNotifyModel(true);
    setTimeout(() => {
      setNotifyModel(false);
    }, 900);
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
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/joinuserPubg`,
        {matchId},
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkuser = async () => {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(
          `${BASE_URL}/khelmela/checkuserPubg`,
          {matchId},
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then(response => {
          if (response.status === 200) {
            setCheckJoined(response.data.message);
          }
        });
    };
    checkuser();
  }, [matchId]);

  const clipboardid = () => {
    Clipboard.setString('hello');
  };

  const clipboardpass = () => {
    Clipboard.setString('hello');
  };

  const addName = async () => {
    setError('');
    setMessage('');
    const token = await AsyncStorage.getItem('token');
    try {
      const payload = {matchId, player1, player2, player3, player4};
      await axios
        .post(`${BASE_URL}/khelmela/addName`, payload, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then(response => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkmatchType = () => {
      axios
        .post(`${BASE_URL}/khelmela/checkmatchTypePubg`, {matchId})
        .then(response => {
          if (response.status === 200) {
            setCheckMatch(response.data.message);
          }
        });
    };
    checkmatchType();
  }, [matchId]);

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
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
      key={matches._id}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={img} alt={'no image'} style={styles.image} />
          <Text style={styles.text}>PUBG Full Match</Text>
        </View>
        <Text style={styles.text}>Player mode: {matches.playermode}</Text>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.title}>MAP: Random</Text>
        <Text style={styles.title}>Total slot:{maxSlots}</Text>
      </View>

      <View style={styles.mapImages}>
        <Image source={erangle} alt="no image" style={styles.imagemap} />
        <Image source={miramar} alt="no image" style={styles.imagemap} />
        <Image source={sanhok} alt="no image" style={styles.imagemap} />
      </View>

      <View style={styles.detailsContainer}>
       <View>
                 <Text style={styles.text}>Winner:</Text>
                 <Text style={styles.text}>{isSolo ? 'Top: 4' : 'Top: 1'}</Text>
                 <Text style={styles.text}>{isSolo ? 'Top: 22' : 'Top: 4'}</Text>
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
          <Text style={{marginLeft: 5}}>Time: {matches.time || '3:00 PM'}</Text>
          {checkJoined === 'notjoined' ? (
            <TouchableOpacity
              style={styles.entryButton}
              onPress={() => {
                setModal(true);
              }}>
              <Text style={{color: 'white'}}>
                Entry fee: {matches.entryFee}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.joinedButton}>
              <Text style={{color: 'white'}}>Joined</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal transparent animationType="slide" visible={modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to join this match?
            </Text>
            <Text>
              Rs {matches.entryFee} will be deducted from your account{' '}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={() => setModal(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.yesButton]}
                onPress={joinuser}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalNotify visible={notifyModel} error={error} message={message} />

      {checkJoined === 'joined' && (
        <View style={styles.joinedContainer}>
          <View style={styles.playerContainer}>
            {matches.playermode === 'Solo' ? (
              <View >
                
                <Text style={{fontSize: 12, color: 'white',marginBottom:5}}>
                    Roomid & pass will be visible before 6 min of the matchtime
                  </Text>
                  <View style={styles.clip}>
                    <View style={styles.input}>
                      <Text>Roomid: 88997888</Text>
                      <TouchableOpacity onPress={clipboardid}>
                        <AntDesign
                          name="copy1"
                          size={17}
                          style={{marginLeft: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.input}>
                      <Text>pass: 54988</Text>
                      <TouchableOpacity onPress={clipboardpass}>
                        <AntDesign
                          name="copy1"
                          size={17}
                          style={{marginLeft: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
<TouchableOpacity onPress={()=>setReportPlayer(true)}>
                                        <Text style={styles.reportButtonText}>report the player</Text>
                                      </TouchableOpacity>
              </View>
               
            ) : (
              <>
                <Text style={styles.squadHeaderText}>
                  Enter Your Squad Member Game Names
                </Text>
                <View style={styles.Row}>
                  <View style={styles.mainplayerbox}>
                    <Text style={styles.mainPlayerText}>{player1}</Text>
                  </View>
                  <TouchableOpacity style={styles.add} onPress={addName}>
                    <Text
                      style={{color: 'black', fontSize: 15, fontWeight: '700'}}>
                      Save{' '}
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
                    />
                    <TextInput
                      style={styles.squadInput}
                      placeholder="Player 3"
                      value={player3}
                      onChangeText={text => setPlayer3(text)}
                      placeholderTextColor="#aaa"
                    />
                    <TextInput
                      style={styles.squadInput}
                      placeholder="Player 4"
                      value={player4}
                      onChangeText={text => setPlayer4(text)}
                      placeholderTextColor="#aaa"
                    />
                  </View>

                  <Text style={{fontSize: 11, color: 'white'}}>
                    Roomid & pass will be visible before 6 min of the matchtime
                  </Text>
                  <View style={styles.clip}>
                    <View style={styles.input}>
                      <Text>Roomid: 8899745445</Text>
                      <TouchableOpacity onPress={clipboardid}>
                        <AntDesign
                          name="copy1"
                          size={17}
                          style={{marginLeft: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.input}>
                      <Text>pass: 54988</Text>
                      <TouchableOpacity onPress={clipboardpass}>
                        <AntDesign
                          name="copy1"
                          size={17}
                          style={{marginLeft: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={()=>setReportPlayer(true)}>
                                        <Text style={styles.reportButtonText}>report the player</Text>
                                      </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      ) }

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
                        <Text style={styles.closeText}>X</Text>
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
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}>
                <ScrollView
                  contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalText}>Report player</Text>
                      <TouchableOpacity
                        onPress={() => setReportPlayerModel(false)}
                        style={styles.closeButton}>
                        <Text style={styles.closeText}>X</Text>
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
                        disabled={loading} onPress={honorScore}>
                        <Text style={styles.buttonText}>
                          {loading ? 'Submitting...' : 'Submit'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </Modal>
              
          
       
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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
  },
  mapContainer: {
    flexDirection: 'row',
    
    marginTop: -10,
    gap:150
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#fff',
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
  texttime: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
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
  soloContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  soloPlayerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  Row: {flexDirection: 'row', marginLeft: 110, gap: 50},
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
  clip: {flexDirection: 'row', gap: 15},
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
  loadingText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: '25%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: '15%',
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
  },
  inputModal: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 50,
    maxHeight: 150,
  },
  uploadContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#87CEEB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  uploadText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  checkMark: {
    color: '#00FF00',
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
  },
  reportButton: {
    marginTop: 10,
  },
  reportButtonText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  reportStatus: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default PubgFullMatchCard;
