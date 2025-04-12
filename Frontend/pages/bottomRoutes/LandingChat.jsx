import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  Modal,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env';
import {jwtDecode} from 'jwt-decode';
import {useFilteredFriends} from '../../filteredFriend';

const LandingChat = ({navigation}) => {
  const [user, setUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clicked, setClicked] = useState(false);
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState('');
  const {filteredFriends, setFilteredFriends} = useFilteredFriends();

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setToken(token);
          setUser(decoded?.id);
          fetchFriends(token);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    getUser();
  }, []);

  // Directly sort by timestamp in latestMessage.time
  const sortByLatestMessage = data => {
    return [...data].sort((a, b) => {
      const timeA = a?.latestMessage?.time
        ? new Date(a.latestMessage.time).getTime()
        : 0;
      const timeB = b?.latestMessage?.time
        ? new Date(b.latestMessage.time).getTime()
        : 0;
      return timeB - timeA;
    });
  };

  const fetchFriends = useCallback(
    async (currentToken = null) => {
      try {
        const tokenToUse =
          currentToken || token || (await AsyncStorage.getItem('token'));
        if (!tokenToUse) {
          Alert.alert('Token Problem');
          return;
        }

        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/khelmela/userRequest/friends`,
          {
            headers: {Authorization: `${tokenToUse}`},
          },
        );

        console.log('Friend Array :', response?.data);
        if (response?.data && response?.data?.length > 0) {
          // First sort by latest message
          const sortedFriends = sortByLatestMessage(response.data);

          // Then reorder to put admin at the top if present
          const adminIndex = sortedFriends.findIndex(
            friend => friend.id === 'admin',
          );

          // If admin exists in the array, remove it and place at the beginning
          if (adminIndex !== -1) {
            const adminUser = sortedFriends.splice(adminIndex, 1)[0];
            sortedFriends.unshift(adminUser);
          }

          console.log(
            'Sorted friends by latest message with admin pinned:',
            sortedFriends.map(f => ({
              username: f?.username,
              time: f?.latestMessage?.time,
            })),
          );

          setFriends(sortedFriends);
          setFilteredFriends(sortedFriends);
        } else {
          setFriends([]);
          setFilteredFriends([]);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        Alert.alert('Error', 'Failed to load friends');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  }, [fetchFriends]);

  const addFriend = async userToAdd => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/addFriends`,
        {friendId: userToAdd?.id},
        {headers: {Authorization: `${token}`}},
      );
      setClicked(true);
      Alert.alert('Success', response?.data?.message || 'Friend added!');
      setTimeout(() => {
        setShowSearchResults(false);
        setClicked(false);
      }, 900);
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to add friend',
      );
    }
  };

  const searchPeople = async () => {
    if (!searchTerm?.trim()) {
      Alert.alert('Error', 'Please enter a name to search');
      return;
    }

    setLoading(true);
    try {
      const tokenToUse = token || (await AsyncStorage.getItem('token'));
      if (!tokenToUse) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/khelmela/search-users`,
        {name: searchTerm},
        {headers: {Authorization: `${tokenToUse}`}},
      );

      if (response?.data && response?.data?.users) {
        setSearchResults(response.data.users);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching users:', error?.message);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to search users',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOnpress = item => {
    navigation?.navigate('PrivateChat', {
      userId: user,
      FriendId: item?.id,
      photoUrl: item?.image || item?.photoUrl,
      name: item?.username || item?.name,
    });
  };

  useEffect(() => {
    console.log('Landing CHat ............------.... ', filteredFriends);
  }, [filteredFriends]);
  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchTerm('');
    fetchFriends();
  };

  const renderEmptyFriendsList = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/khelmela-98.firebasestorage.app/o/mainLogo%2Flogo.jpg?alt=media&token=07f1f6ae-2391-4143-83f4-6ff44bba581b',
        }}
        style={styles.emptyLogo}
      />
      <Text style={styles.emptyText}>No chats yet</Text>
      <Text style={styles.emptySubText}>
        Search for players to start chatting
      </Text>
      <TouchableOpacity
        style={styles.emptySearchButton}
        onPress={() => setSearchTerm('a')}>
        <Text style={styles.emptySearchButtonText}>Find Players</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles?.safeArea}>
      <StatusBar backgroundColor="#417D80" barStyle="light-content" />
      <View style={styles?.mainContainer}>
        <View style={styles?.headerContainer}>
          <Text style={styles?.header}>Chat</Text>
        </View>

        <View style={styles?.searchContainer}>
          <View style={styles?.searchWrapper}>
            <TextInput
              style={styles?.searchBar}
              placeholder="Search Friend"
              placeholderTextColor="#8A8A8A"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity
              style={styles?.searchButton}
              onPress={searchPeople}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles?.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles?.listContainer}>
          <Text style={styles?.sectionTitle}>Recent Chats</Text>
          <FlatList
            data={filteredFriends}
            keyExtractor={item =>
              item?._id || item?.id || Math.random().toString()
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles?.friendCard}
                onPress={() => handleOnpress(item)}
                activeOpacity={0.7}>
                <Image
                  source={{
                    uri:
                      item?.image ||
                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                      
                  }}
                  style={styles?.avatar}
                />
                <View style={styles?.friendInfo}>
                  <Text style={styles?.friendName}>
                    {item?.username || item?.name || 'User'}
                  </Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {typeof item.latestMessage?.message === 'string'
                      ? item.latestMessage.message
                      : 'Tap to start chatting'}
                  </Text>
                </View>
                <View style={styles?.lastSeenContainer}>
                  {item?.latestMessage?.time && (
                    <Text style={styles?.timeStamp}>
                      {new Date(item.latestMessage.time).toLocaleTimeString(
                        [],
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </Text>
                  )}
                  <View
                    style={[
                      styles?.onlineIndicator,
                      item?.online && styles?.online,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={renderEmptyFriendsList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles?.listContentContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#417D80']}
                tintColor="#417D80"
              />
            }
          />
        </View>

        {/* Search Results Modal */}
        <Modal
          visible={showSearchResults}
          animationType="slide"
          transparent={true}
          onRequestClose={closeSearchResults}>
          <View style={styles?.modalContainer}>
            <View style={styles?.modalContent}>
              <Text style={styles?.modalHeader}>Search Results</Text>

              {searchResults?.length === 0 ? (
                <View style={styles?.noResultsContainer}>
                  <Text style={styles?.noResults}>No users found</Text>
                  <Text style={styles?.noResultsSubtext}>
                    Try searching with a different name
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={searchResults}
                  keyExtractor={item => item?.id || Math.random().toString()}
                  renderItem={({item}) => (
                    <View style={styles?.searchResultItem}>
                      <TouchableOpacity
                        style={styles?.userInfoContainer}
                        onPress={() => handleOnpress(item)}>
                        <Image
                          source={{
                            uri:
                              item?.image ||
                               'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                              
                          }}
                          style={styles?.resultAvatar}
                        />
                        <View style={styles?.resultUserInfo}>
                          <Text style={styles?.resultUsername}>
                            {item?.username || 'User'}
                          </Text>
                          <Text style={styles?.resultSubtext}>Tap to chat</Text>
                        </View>
                      </TouchableOpacity>
                      {!clicked && (
                        <TouchableOpacity
                          style={styles?.addButton}
                          onPress={() => addFriend(item)}>
                          <Text style={styles?.addButtonText}>Add Friend</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  contentContainerStyle={styles?.resultListContainer}
                />
              )}

              <TouchableOpacity
                style={styles?.closeButton}
                onPress={closeSearchResults}>
                <Text style={styles?.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#417D80', // Slightly darker than the main color for status bar
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',

    elevation: 4,

    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'Black',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 5,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'Black',
    marginBottom: 15,
  },
  listContentContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'black',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  lastSeenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  timeStamp: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginBottom: 4,
  },
  online: {
    backgroundColor: '#4CD964',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptySearchButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  emptySearchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#F2F2F2',
    color: 'black',
  },
  resultListContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#5DADB0',
  },
  resultUserInfo: {
    flex: 1,
  },
  resultUsername: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,

    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 'auto',
    width: 150,
    marginLeft: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noResultsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noResults: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
});

export default LandingChat;
