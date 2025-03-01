import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {IP, SERVER_PORT} from '../env';
import axios from 'axios';
import MoneyRequestCard from './components/MoneyRequestCard';
const Withdraw = () => {
  return (
    <>
      <Text> Withdraw Requests </Text>
    </>
  );
};

const AdminHome = () => {
  const [toggle, setToggle] = useState('moneyRequest');
  const [item, setItem] = useState([
    {gameName: 'raiden', amount: 100, remark: 'test'},
  ]);
  const admin = 'Arjun';
  useEffect(() => {
    console.log(`${IP}:${SERVER_PORT}/money/admin/getMoneyRequest`);

    const getData = async () => {
      try {
        const response = await axios.get(
          `${IP}:${SERVER_PORT}/money/admin/getMoneyRequest`,
        );
        setItem(response.data); // Use response.data directly
        console.log(response.data);
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        console.log('finally');
      }
    };
    getData();
  }, [toggle]);

  // Function to handle rendering components
  const handleRender = () => {
    const handleDropRelease = id => {};
    if (toggle === 'moneyRequest') {
      return (
        <ScrollView>
          {item.map((request, index) => (
            <MoneyRequestCard
              key={index}
              gameName={request.gameName}
              amount={request.amount}
              remark={request.remark}
              onPress={() => handleDropRelease(request)}
            />
          ))}
        </ScrollView>
      );
    } else if (toggle === 'withDraw') {
      return <Withdraw />;
    } else {
      return <Text>No content</Text>;
    }
  };

  return (
    <>
      <View style={{}}>
        <Text style={styles.adminText}>Admin: {admin}</Text>
        {/* Toggle Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={
              toggle === 'moneyRequest' ? styles.activeButton : styles.Button
            }
            onPress={() => setToggle('moneyRequest')}>
            <Text> Add Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={toggle === 'withDraw' ? styles.activeButton : styles.Button}
            onPress={() => setToggle('withDraw')}>
            <Text>Withdraw Request </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render the selected component */}
      {handleRender()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#011638',
  },
  Button: {
    backgroundColor: 'skyblue',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'orange',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },

  adminText: {
    backgroundColor: 'lightgreen',
    fontWeight: 'bold',
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default AdminHome;
