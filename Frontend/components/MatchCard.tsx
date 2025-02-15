import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Animated, Button, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
const MatchCard = ({match}) => {
  const[check,setCheck]=useState('')
 
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
  return (
    <>
            <FlatList data={match.matchDetails} keyExtractor={(item,id)=>id.toString()}
            renderItem={({item})=>(
              <TouchableOpacity onPress={checkUserOrAdmin}>
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
                  <Text style={styles.entryText}> Entry:{item.betAmount} </Text>
                </View>
              </View>
            </View>
          </View>
          {
            check === 'host'? <View>
            <Text>this is admin</Text>
          </View>:<View><Text>this is user</Text></View>
          }
         
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
    justifyContent: 'space-between',
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
    marginRight: 40,
  },
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
