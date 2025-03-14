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

const LandingChat = ({navigation, route}) => {
  const {friends: initialFriends} = route.params;
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState(initialFriends);
  const [filteredFriends, setFilteredFriends] = useState(initialFriends);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch updated friends list
  const fetchFriends = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/khelmela/getFriends/${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data && response.data.friends) {
        setFriends(response.data.friends);
        setFilteredFriends(response.data.friends);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  }, [fetchFriends]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded = jwtDecode(token);
        setUser(decoded.id);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getUser();
  }, []);

  const searchPeople = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Error', 'Please enter a name to search');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/khelmela/search-users`, {
        name: searchTerm,
      });

      setSearchResults(response.data.users || []);
      console.log(response.data.users);

      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async userToAdd => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/addFriends/${token}`,
        {
          username: userToAdd.username,
          image: userToAdd.image || ' default',
          friendId: userToAdd.id,
          userId: user,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', response.data?.message || 'Friend  added !');
      // Refresh friends list after adding a friend
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add friend',
      );
    }
  };

  const handleOnpress = item => {
    navigation.navigate('PrivateChat', {
      userId: user,
      FriendId: item.id,
      photoUrl: item.image || item.photoUrl,
      name: item.username || item.name,
    });
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchTerm('');
    // Refresh friends list when modal closes
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#417D80" barStyle="light-content" />
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Chat</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search Friend"
              placeholderTextColor="#8A8A8A"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchPeople}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Recent Chats</Text>
          <FlatList
            data={filteredFriends}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.friendCard}
                onPress={() => handleOnpress(item)}
                activeOpacity={0.7}>
                <Image
                  source={{
                    uri:
                      item.photoUrl ||
                      item.image ||
                      'https://storage.googleapis.com/khelmela-98.firebasestorage.app/users/13cca677-dc05-4fb3-9ee4-c80b745ac8a0-.jpg',
                  }}
                  style={styles.avatar}
                />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>
                    {item.username || item.name}
                  </Text>
                  <Text style={styles.lastMessage}>Tap to start chatting</Text>
                </View>
                <View style={styles.lastSeenContainer}>
                  <View style={styles.onlineIndicator} />
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={renderEmptyFriendsList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
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
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Search Results</Text>

              {searchResults.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResults}>No users found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try searching with a different name
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={searchResults}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <View style={styles.searchResultItem}>
                      <TouchableOpacity
                        style={styles.userInfoContainer}
                        onPress={() => handleOnpress(item)}>
                        <Image
                          source={{
                            uri:
                              item.image ||
                              'https://firebasestorage.googleapis.com/v0/b/khelmela-98.firebasestorage.app/o/mainLogo%2Flogo.jpg?alt=media&token=07f1f6ae-2391-4143-83f4-6ff44bba581b',
                          }}
                          style={styles.resultAvatar}
                        />
                        <View style={styles.resultUserInfo}>
                          <Text style={styles.resultUsername}>
                            {item.username}
                          </Text>
                          <Text style={styles.resultSubtext}>Tap to chat</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addFriend(item)}>
                        <Text style={styles.addButtonText}>Add Friend</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={styles.resultListContainer}
                />
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeSearchResults}>
                <Text style={styles.closeButtonText}>Close</Text>
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
    textAlign:'center'
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
    borderWidth: 2,
    borderColor: '#5DADB0',
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
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    marginBottom: 4,
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
    width:150,
    marginLeft:100,
    borderRadius:50,
    marginBottom:10
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