import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Animated, Button, TouchableOpacity} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
const MatchCard = ({match}) => {
  const[check,setCheck]=useState('')
  const [customId, setCustomId] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  useEffect(()=>{
    const checkUserOrAdmin =async()=>{
      const matchId = match._id
      const token = await AsyncStorage.getItem('token')
  await axios.post('http://30.30.6.248:3000/khelmela/checkUserOrAdmin',{matchId},{
    headers:{
      Authorization:`${token}`
    }
  })
  .then((response)=>{
    console.log(response)
      setCheck(response.data.message)
  })
    }
    checkUserOrAdmin()
  },[])
 
  return (
    <>
            <FlatList data={match.matchDetails} keyExtractor={(item,id)=>id.toString()}
            renderItem={({item})=>(
              <TouchableOpacity>
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
            check === 'user'? <TouchableOpacity style={{backgroundColor:'green',padding:5}}>
              <Text style={styles.entryText}> Entry:{item.betAmount} </Text>
            </TouchableOpacity>:  <TouchableOpacity style={{backgroundColor:'green',padding:5}}>
              <Text style={styles.entryText}> joined </Text>
            </TouchableOpacity>
          }
                </View>
              </View>
            </View>
            {
              check === 'host'?<View style={styles.container}>
              {/* Left Side - Inputs */}
              <View style={styles.leftContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Custom ID"
                  value={customId}
                  onChangeText={setCustomId}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Custom Password"
                  secureTextEntry
                  value={customPassword}
                  onChangeText={setCustomPassword}
                />
              </View>
        
              {/* Right Side - Button */}
              <View style={styles.rightContainer}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Publish</Text>
                </TouchableOpacity>
              </View>
        
              {/* Bottom Text */}
              <Text style={styles.footerText}>Submit Your Result</Text>
            </View>
            :check === 'userjoined'? <View style={styles.leftContainer}>
           <View style={styles.input}>
            <Text>customPassword:</Text>
          </View>
            <View style={styles.input}>
            <Text>customPassword:</Text>
          </View>
          </View>
        :null}
          </View> 
              </TouchableOpacity>
            )}/>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: 'white',
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
  leftContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
    bottom: 0,
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft:100,
  }
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




