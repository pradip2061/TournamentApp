import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {BASE_URL} from '../../env';
import {useFocusEffect} from '@react-navigation/native';

const Champions = () => {
  const [filter, setFilter] = useState('month');
  const [data, setData] = useState({});
  const [userData, setUserData] = useState([]);
  console.log(userData);
  const [index, setIndex] = useState(0);
  
    useFocusEffect(
      useCallback(() => {
          console.log("Tab Screen Mounted");
          try {
            const getMatches = async () => {
              const token = await AsyncStorage.getItem('token');
              await axios
                .get(`${BASE_URL}/khelmela/getchampions`, {
                  headers: {
                    Authorization: `${token}`,
                  },
                })
                .then(response => {
                  setData(response.data.userinfo);
                  setUserData(response.data.userdata);
                  setIndex(response.data.index);
                });
            };
            getMatches();
          } catch (error) {
            console.log(error);
          }
          return () => {
              console.log("Tab Screen Unmounted");
          };
      }, [])
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter('week')}
          style={[
            styles.filterButton,
            filter === 'week' && styles.activeFilter,
          ]}>
          <Text
            style={[styles.filterText, filter === 'week' && styles.activeText]}>
            This Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('month')}
          style={[
            styles.filterButton,
            filter === 'month' && styles.activeFilter,
          ]}>
          <Text
            style={[
              styles.filterText,
              filter === 'month' && styles.activeText,
            ]}>
            This Month
          </Text>
        </TouchableOpacity>
      </View>
      {filter === 'month' ? (
        <>
          {/* Top 3 Players */}
          <View style={styles.topThreeContainer}>
            {/* Second Place */}
            <View style={[styles.topPlayerContainer, styles.secondPlace]}>
              <Image
                source={{
                  uri:
                    userData?.[1]?.image ||
                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                style={[styles.avatar, styles.secondAvatar]}
              />
              <Text style={styles.playerName}>{userData?.[1]?.username}</Text>
              <Text style={[styles.score, {color: '#C0C0C0'}]}>
                {userData?.[1]?.trophy} pts
              </Text>
            </View>

            {/* First Place */}
            <View style={[styles.topPlayerContainer, styles.firstPlace]}>
              <Image
                source={{
                  uri: 'https://imgs.search.brave.com/4YhsSPJTo2gK7HvyQsKKpZKybWT53c1JG11kQqQsT3g/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvNS9Dcm93/bi1QTkctUGljLnBu/Zw',
                }}
                style={styles.crown}
              />
              <Image
                source={{
                  uri:
                    userData?.[0]?.image ||
                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                style={[styles.avatar, styles.firstAvatar]}
              />
              <Text style={styles.playerName}>{userData?.[0]?.username}</Text>
              <Text style={[styles.score, {color: '#FFD700'}]}>
                {userData?.[0]?.trophy} pts
              </Text>
            </View>

            {/* Third Place */}
            <View style={[styles.topPlayerContainer, styles.thirdPlace]}>
              <Image
                source={{
                  uri:
                    userData?.[2]?.image ||
                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                style={[styles.avatar, styles.thirdAvatar]}
              />
              <Text style={styles.playerName}>{userData?.[2]?.username}</Text>
              <Text style={[styles.score, {color: '#CD7F32'}]}>
                {userData?.[2]?.trophy} pts
              </Text>
            </View>
          </View>
          {/* Leaderboard List */}
          <FlatList
            data={userData.slice(3)}
            keyExtractor={item => item._id.toString()}
            renderItem={({item, index}) => (
              <View style={styles.listItem}>
                <Text style={styles.rank}>{index + 4}</Text>
                <Image
                  source={{
                    uri:
                      item?.image ||
                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                  }}
                  style={styles.avatarSmall}
                />
                <View style={styles.listTextContainer}>
                  <Text style={styles.playerName}>{item.username}</Text>
                  <Text style={styles.score}>{item.trophy} pts</Text>
                </View>
              </View>
            )}
            style={{marginTop: -10}}
          />
          <View style={styles.listItems}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Image
              source={{
                uri:
                  data?.image ||
                  'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
              }}
              style={styles.avatarSmall}
            />
            <View style={styles.listTextContainer}>
              <Text style={styles.playerName}>{data.username}</Text>
              <Text style={styles.score}>{data.trophy} pts</Text>
            </View>
          </View>
        </>
      ) : (
        <Text
          style={{
            marginLeft: 110,
            marginTop: 250,
            fontWeight: 900,
            fontSize: 18,
          }}>
          Comming soon...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#F5F5F5', // Light gray background for contrast
  },
  title: {
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  filterButton: {
    backgroundColor: '#FFB400',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    opacity: 0.7,
  },
  activeFilter: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#333',
  },
  filterText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 53,
  },
  topPlayerContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  firstPlace: {
    marginBottom: 40,
  },
  secondPlace: {
    marginTop: 20,
  },
  thirdPlace: {
    marginTop: 40,
  },
  crown: {
    width: 80,
    height: 50,
    position: 'absolute',
    top: -50,
    zIndex: 1,
  },
  avatar: {
    borderRadius: 50,
  },
  firstAvatar: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: '#FFD700', // Gold border
  },
  secondAvatar: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#C0C0C0', // Silver border
  },
  thirdAvatar: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#CD7F32', // Bronze border
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB400',
    marginRight: 10,
  },
  playerName: {
    color: '#333',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    // For Android shadow
  },
  listItems: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    borderColor: 'green',
    borderWidth: 1,
    // For Android shadow
  },
  rank: {
    color: '#333',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  listTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Champions;
