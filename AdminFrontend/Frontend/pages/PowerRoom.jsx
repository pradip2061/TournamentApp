import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Switch} from 'react-native';

const PowerRoom = () => {
  const player = {
    id: '',
    email: 'test@gmail.com',
    name: 'Arjun',
    balance: 120,
    trophy: 200,
  };
  const item = {
    gunAttribute: 'true',
    betAmount: 100,
    coin: 'Default',
    round: 3,
    headshot: ' yes',
  };

  const toggleSwitch = value => {
    setOption(value ? 'Game Name' : 'ID');
  };
  const [option, setOption] = useState('Id');
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{fontSize: 30}}> Power Room</Text>
        <View style={styles.box}>
          <Text style={styles.header}> Search for User</Text>
          <Switch
            value={option === 'Game Name'}
            onValueChange={toggleSwitch}
            activeText={'Id'}
            inActiveText={'Game Name'}
            circleSize={30}
            barHeight={40}
            backgroundActive={'#4caf50'}
            backgroundInactive={'#f44336'}
            circleBorderWidth={0}
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2.5}
          />
          <View style={styles.itemwrapper}>
            <TextInput placeholder={option} style={styles.Input}></TextInput>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#cdcdcd'}]}>
              <Text> Search</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.info.infobox}> ID: {player?.id}</Text>
          <Text style={styles.info.infobox}> Email: {player?.email}</Text>

          <View style={styles.itemwrapper}>
            <Text style={styles.info}>gameName: {player?.name}</Text>
            <Text style={styles.info}>balance:{player?.balance}</Text>
            <Text style={styles.info}>Trophy🏆: {player?.trophy}</Text>
          </View>
          <View style={styles.itemwrapper}></View>

          <TouchableOpacity style={styles.button}>
            <Text style={{color: 'white'}}> History </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.box, {height: 500}]}>
          <Text style={styles.header}> Search for Match</Text>

          <View style={styles.itemwrapper}>
            <TextInput
              placeholder={'Match_id'}
              style={styles.Input}></TextInput>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#cdcdcd'}]}>
              <Text> Search</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.playerName}>Player-Host</Text>

          <Text style={styles.info.infobox}> ID: {player?.id}</Text>

          <Text style={styles.info.infobox}>Email : {player?.email}</Text>

          <View style={styles.itemwrapper}></View>

          <Text style={styles.playerName}> Player2 </Text>
          <Text style={styles.info.infobox}> ID: {player?.id}</Text>
          <Text style={styles.info.infobox}> Email: {player?.email}</Text>

          <View style={styles.itemwrapper}></View>

          <Text style={styles.info}></Text>

          <View style={[styles.itemwrapper, {marginTop: -15}]}>
            <View style={styles.column}>
              <Text style={styles.infoMatch}>🎮 Mode:{item?.player} </Text>
              <Text style={styles.infoMatch}>🔫 skills:{item?.skill}</Text>
              <Text style={styles.infoMatch}>🎯 Headshot:{item?.headshot}</Text>
              <Text style={styles.infoMatch}>🗺️ match:{item?.match}</Text>
            </View>
            <View style={styles.itemwrapper}>
              <View style={styles.column}>
                <Text style={styles.infoMatch}>
                  💥 Limited Ammo:{item?.ammo}
                </Text>
                <Text style={styles.infoMatch}>🔄 Rounds:{item?.round}</Text>
                <Text style={styles.infoMatch}>💰 Coin:{item?.coin} </Text>
              </View>
            </View>
          </View>
          <View style={styles.info} />

          <Text style={[styles.info, {fontSize: 20}]}>
            🏆 Prize:{item?.betAmount * 1.8}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFF8EB',
  },

  box: {
    backgroundColor: '#DFF8EB',
    borderWidth: 1,
    marginTop: 50,
    borderRadius: 20,
    height: 400,
    width: '97%',
    marginLeft: 8,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },

  Input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    width: 230,
    marginLeft: 20,
    marginTop: 10,
  },
  info: {
    marginLeft: 20,
    marginTop: 10,
    infobox: {
      marginTop: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      width: 250,
      marginLeft: 20,
    },
  },

  infoMatch: {
    marginLeft: 20,
    marginTop: 10,
    marginRight: 80,
  },

  itemwrapper: {
    flexDirection: 'row',
  },
  button: {
    width: 70,
    height: 35,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 25,
    marginTop: 12,
  },

  playerName: {
    fontSize: 17,
    color: 'green',
  },
});

export default PowerRoom;
