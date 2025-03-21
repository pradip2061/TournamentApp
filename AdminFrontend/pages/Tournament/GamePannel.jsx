import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FreeFire from '../freefire/FreeFire';
import Pubg from '../pubg/Pubg';
import MatchTypeModal from '../../components/CreateModal';

const AdminHome = () => {
  const [toggle, setToggle] = useState('FreeFire');
  const [modalVisible, setModalVisible] = useState(false);

  const admin = 'Arjun';

  const handleRender = () => {
    if (toggle === 'FreeFire') {
      return (
        <>
          <FreeFire />
        </>
      );
    } else if (toggle === 'PubG') {
      return <Pubg />;
    } else {
      return <Text>No content</Text>;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.adminText}>Admin: {admin}</Text>

        {/* Toggle Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={toggle === 'FreeFire' ? styles.activeButton : styles.Button}
            onPress={() => setToggle('FreeFire')}>
            <Text style={styles.toggleButtonText}>Free Fire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={toggle === 'PubG' ? styles.activeButton : styles.Button}
            onPress={() => setToggle('PubG')}>
            <Text style={styles.toggleButtonText}>Pubg</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Match Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>Create Match</Text>
      </TouchableOpacity>

      {/* Render the selected component */}
      <View style={styles.contentContainer}>{handleRender()}</View>
      {modalVisible && (
        <MatchTypeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}

      {/* Match Card Creation Modal */}
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: 'orange',
    width: '30%',
    alignSelf: 'flex-end',
    margin: 15,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e67e00',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
  },
  Button: {
    backgroundColor: 'skyblue',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  toggleButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  adminText: {
    backgroundColor: 'lightgreen',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
});

export default AdminHome;
