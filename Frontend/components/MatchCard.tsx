import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Animated, Button, TouchableOpacity, Modal, Alert} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from "@react-native-clipboard/clipboard";
import ModalNotify from './ModalNotify';
import { launchImageLibrary } from 'react-native-image-picker';
import { CheckAdminContext } from '../pages/ContextApi';
const MatchCard = ({match}) => {
  const[check,setCheck]=useState('')
  const [customId, setCustomId] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const[error,setError]=useState('')
  const[message,setMessage]=useState('')
  const[publish,setPublish]=useState('')
  const[modalReset,setModalReset]=useState(false)
  const[modalDidYouWin,setModalDidYouWin]=useState(false)
  const customid = match.customId
  const custompassword = match.customPassword
  const[notifyModel,setNotifyModel]=useState(false)
  const[result,setResult]=useState('')
   const [selectedImage, setSelectedImage] = useState(null);
  console.log(result)
  const matchId = match._id
  const{setGetData}=useContext(CheckAdminContext)
  useEffect(()=>{
    const checkUserOrAdmin =async()=>{
      const token = await AsyncStorage.getItem('token')
  await axios.post(`${process.env.baseUrl}/khelmela/checkUserOrAdmin`,{matchId},{
    headers:{
      Authorization:`${token}`
    }
  })
  .then((response)=>{
      setCheck(response.data.message)
      console.log(check)
  })
    }
    checkUserOrAdmin()
  },[check,message])


   const checking =async()=>{
        try {
          setError('')
          setMessage('')
         const token = await AsyncStorage.getItem('token')
         console.log(token)
         await axios.post(`${process.env.baseUrl}/khelmela/check`,{},{
           headers:{
             Authorization:`${token}`
           }
         })
         .then((response)=>{
           if(response.status == 200){
             setModalVisible(true)
             setMessage('user is free')
           }else{
            setModalVisible(false)
           }
         })
        } catch (error) {
         console.log(error)
         setError(error.response.data.message)
        }finally{
         notify()
        }
       }

       const notify=()=>{
        setNotifyModel(true)
        setTimeout(()=>{
          setNotifyModel(false)
        },900)
       }

       const customIdAndPassword =async(e)=>{
        e.preventDefault()
        try {
         await axios.post(`${process.env.baseUrl}/khelmela/setpass`,{customId,customPassword,matchId})
         .then((response)=>{
           if(response.status == 200){
           setMessage(response.data.message)
           }
         })
        } catch (error) {
         console.log(error)
         setError(error.response.data.message)
        }
       }
       const joinuser =async()=>{
        try {
          setError('')
          setMessage('')
         const token = await AsyncStorage.getItem('token')
         console.log(token)
         await axios.post(`${process.env.baseUrl}/khelmela/join`,{matchId},{
           headers:{
             Authorization:`${token}`
           }
         })
         .then((response)=>{
           if(response.status == 200){
             setModalVisible(false)
             setMessage(response.data.message)
             
           }else{
            setModalVisible(true)
           }
         })
        } catch (error) {
         console.log(error)
         setError(error.response.data.message)
        } finally{
          notify()
        }
       }
      
       useEffect(()=>{
        const checkpublish =async()=>{
         try {
          await axios.post(`${process.env.baseUrl}/khelmela/checkpublish`,{matchId})
          .then((response)=>{
           if(response.status == 200){
             setPublish(response.data.message)
           }
           }
         )
         } catch (error) {
          setError(error.response.data.message)
         }
          }
          checkpublish()
       },[message])
       const copyToClipboardId = () => {
        Clipboard.setString(match.customId.toString());
      };
      const copyToClipboardPass = () => {
        Clipboard.setString(match.customPassword.toString());
      };
      const reset =async()=>{
       try {
        setError('')
          setMessage('')
        await axios.post(`http://localhost:3000/khelmela/changecustom`,{matchId,customId,customPassword})
        .then((response)=>{
          if(response.status == 200){
            setPublish(response.data.message)
            setModalReset(false)
            setGetData('done')
          }
          })
       } catch (error) {
        setError(error.response.data.message)
       }finally{
        notify()
       }
      }
      const submitresultIfYes = async()=>{
        try {
        const boolean = false
        const token = await AsyncStorage.getItem('token')
await axios.post(`${process.env.baseUrl}/khelmela/checkBoolean`,{
  matchId,
  boolean
},{
  headers:{
    Authorization:`${token}`
  }
})
.then((response)=>{
  setMessage(response.data.message)
})
        } catch (error) {
          setError(error.data.response.message)
        }finally{
          setModalDidYouWin(false)
          notify()
        }
      }
      const submitresultIfNo = async()=>{
      try {
        const boolean = false
        const token = await AsyncStorage.getItem('token')
await axios.post(`${process.env.baseUrl}/khelmela/checkBoolean`,{
  matchId,
boolean
},{
  headers:{
    Authorization:`${token}`
  }
})
.then((response)=>{
  setMessage(response.data.message)
})
      } catch (error) {
        setError(error.response.data.message)
      }finally{
        setModalDidYouWin(false)
        notify()
      }
      }

      useEffect(()=>{
        const checkresult = async()=>{
try {
  await axios.post(`${process.env.baseUrl}/khelmela/checkresult`,{matchId})
  .then((response)=>{
    setResult(response.data.message)
  })
} catch (error) {
  setError(error.response.data.message)
  notify()
}
        }
        checkresult()
      },[])
      const openGallery=()=>{
          const options = {
            mediaType: "photo",
            quality: 0.5,
          };
          launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.errorMessage) {
              console.log("ImagePicker Error: ", response.errorMessage);
            } else {
              setSelectedImage(response.assets[0].uri); 
              const getFileNameFromUri = (selectedImage) => {
                return selectedImage.split('/').pop(); // Get last part of URI
              };
              const filename = getFileNameFromUri(selectedImage)
              console.log(filename)
              uploadPhoto(filename)
            }
          });
        }
        const uploadPhoto = async(selectedImage)=>{
          console.log(selectedImage)
         const response = await axios.post(`${process.env.baseUrl}/khelmela/upload`,{
            selectedImage
          },{
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          console.log(response)
        }
  return (
    <>
            <FlatList data={match.matchDetails}  scrollEnabled={false}  keyExtractor={(item,id)=>id.toString()}
            renderItem={({item})=>(
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Battle</Text>
                <Image
                  source={require('../assets/freefire.jpeg')}
                  style={styles.gameIcon}
                />
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.text}>🎮 Mode:{item.player} </Text>
                  <Text style={styles.text}>🔫 skills:{item.skill }</Text>
                  <Text style={styles.text}>🎯 Headshot:{item.headshot}</Text>
                  <Text style={styles.text}>🗺️ match:{item.match}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.text}>💥 Limited Ammo:{item.ammo}</Text>
                  <Text style={styles.text}>🔄 Rounds:{item.round}</Text>
                  <Text style={styles.text}>💰{item.coin ? 'coin:'+item.coin:""} </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.footer}>
                <Text style={styles.text}>👾 Opponent:{item.gameName}</Text>
               
                <View style={styles.footerRow}>
                  <Text style={styles.prizeText}>🏆 Prize:{item.betAmount*1.5}</Text>
                  
                  {
            check === 'user'? <TouchableOpacity  activeOpacity={1} style={{backgroundColor:'green',padding:5}} onPress={checking}>
              <Text style={styles.entryText}> Entry:{item.betAmount} </Text>
            </TouchableOpacity>: check==='userjoined'? <TouchableOpacity style={{backgroundColor:'green',padding:5}}>
              <Text style={styles.entryText}> joined </Text>
            </TouchableOpacity>:null
          }
                </View>
              </View>
            </View>
            {
              check === 'host'?
                <View style={styles.container}>
                {
                  publish === 'publish'? <View>
                    <View style={{flexDirection:"row",alignItems:"center",paddingBottom:50,gap:30}}><View style={styles.leftContainer}>
                  <TouchableOpacity onPress={copyToClipboardId}>
                  <View style={styles.inputs}>
                  <Text>customId:{match.customId}</Text>
                  </View>
                  </TouchableOpacity>
                  <TouchableOpacity  onPress={copyToClipboardPass}>
                  <View style={styles.inputs}>
                  <Text >customId:{match.customPassword}</Text>
                  </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.rightContainer}>
                   <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Reset</Text>
                  </TouchableOpacity>               
                </View>
                </View>
                <View>
                {
                  result === 'booleanMatch'? <Text style={{textAlign:'center'}}>result submitted</Text>:result === 'booleanNotMatch'?
                  <TouchableOpacity onPress={openGallery}><Text style={{textAlign:'center'}}>upload your match photo</Text></TouchableOpacity>:
                  result ==='noresponse'?<TouchableOpacity onPress={()=>setModalDidYouWin(true)} style={styles.footerText}>
                    <Text style={{marginLeft:25,textDecorationLine:'underline'}}>Submit Your Result</Text>
                  </TouchableOpacity>:null
                }
                </View>
                </View>:<> <View style={styles.leftContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Custom ID"
                     keyboardType='numeric'
                    value={customId}
                    onChangeText={setCustomId}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Custom Password"
                    secureTextEntry
                    keyboardType='numeric'
                    value={customPassword}
                    onChangeText={setCustomPassword}
                  />
                </View>

                <View style={styles.rightContainer}>
                   <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={customIdAndPassword}>Publish</Text>
                  </TouchableOpacity>               
                </View></>
                }
            </View>
            :check === 'userjoined'? <View>
            <View style={{flexDirection:"row",alignItems:"center",paddingBottom:50,gap:30}}><View style={styles.leftContainer}>
          <TouchableOpacity onPress={copyToClipboardId}>
          <View style={styles.inputs}>
          <Text>customId:{match.customId}</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={copyToClipboardPass}>
          <View style={styles.inputs}>
          <Text >customId:{match.customPassword}</Text>
          </View>
          </TouchableOpacity>
        </View>
        </View>
        <View>
        {
          result === 'booleanMatch'? <Text style={{textAlign:'center'}}>result submitted</Text>:result === 'booleanNotMatch'?
          <TouchableOpacity onPress={openGallery}><Text style={{textAlign:'center'}}>upload your match photo</Text></TouchableOpacity>:
          result ==='noresponse'?<TouchableOpacity onPress={()=>setModalDidYouWin(true)} style={styles.footerText}>
            <Text style={{marginLeft:25,textDecorationLine:'underline'}}>Submit Your Result</Text>
            </TouchableOpacity>
          :null
        }
        </View>
        </View>
        :null}
          </View> 
          <Modal transparent animationType="slide" visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Are you sure?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.noButton]} onPress={()=>setModalVisible(false)}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={joinuser}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal transparent animationType="slide" visible={modalDidYouWin}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Did you Win Match?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.noButton]} onPress={submitresultIfNo}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={submitresultIfYes}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal visible={modalReset} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: "80%", padding: 20, backgroundColor: "white", borderRadius: 10, alignItems: "center" }}>
          <TextInput placeholder="Custom ID" value={customid} onChangeText={setCustomId} style={{ width: "100%", borderWidth: 1, marginBottom: 10, padding: 10 }} />
          <TextInput placeholder="Custom Password" value={custompassword} secureTextEntry onChangeText={setCustomPassword} style={{ width: "100%", borderWidth: 1, padding: 10 }} />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity onPress={reset} style={{ backgroundColor: "green", padding: 10, margin: 5 }}>
              <Text style={{ color: "white" }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setModalReset(false)} style={{ backgroundColor: "red", padding: 10, margin: 5 }}>
              <Text style={{ color: "white" }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <ModalNotify visible={notifyModel} error={error} message={message}/>
              </TouchableOpacity>
            )}/>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: 'white',
    height:470,
    paddingBottom:20
  },
  cardContent: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  column: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
  text: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  footer: {
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    gap:120,
    alignItems:'center'
  },
  prizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  entryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'lightgreen',
  },
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginBottom:10
  },
  input: {
    width:136,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputs: {
    width:180,
    height:40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft:5,
    display:'flex',
    justifyContent:'center',
    marginLeft:10,
    marginTop:10
  },
  rightContainer: {
    marginLeft: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footerText: {
    position: "absolute",
    bottom: -20,
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft:100,
    marginTop:20,
    textAlign:'center'
  },
  openButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  openButtonText: { color: "#fff", fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 300, alignItems: "center" },
  modalText: { fontSize: 18, marginBottom: 20 },
  buttonContainer: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  noButton: { backgroundColor: "#dc3545" },
  yesButton: { backgroundColor: "#28a745" },
});

export default MatchCard;

// const fadeIn = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,  // Fade to fully visible
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   };

// const fadeOut = () => {
//   Animated.timing(fadeAnim, {
//     toValue: 0,  // Fade to completely invisible
//     duration: 1000,
//     useNativeDriver: true,
//   }).start();
// };
// const [fadeAnim] = useState(new Animated.Value(0));

// { opacity: fadeAnim }


