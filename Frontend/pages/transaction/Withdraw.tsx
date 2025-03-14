import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {baseUrl} from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Withdraw = () => {
  const [selectedMethod, setSelectedMethod] = useState('eSewa');
  const [amount, setAmount] = useState('');
  const [number, setNumber] = useState('');

  const handleWithdraw = async () => {
    console.log('withDraw ----------------->>>>>> ');
    if (!amount || !number) {
      Alert.alert('All fields are required ');
      return;
    }

    const token = await AsyncStorage.getItem('token');

    console.log(token);

    if (!token) {
      Alert.alert('Please login first');
      return;
    }
    if (number.length != 10) {
      Alert.alert('Invalid number');
      return;
    }
    if (parseInt(amount) <= 99) {
      Alert.alert('Minimum withdraw amount is 100');
      return;
    }

    const data = {
      method: selectedMethod,
      amount: amount,
      number: number,
    };

    console.log(`${baseUrl}/khelmela/withdraw/${token}`);

    const res = await axios.post(`${baseUrl}/khelmela/withdraw/${token}`, data);

    console.log(res.data);
    Alert.alert(res.data.message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Payment Method</Text>
      <View style={styles.methodContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedMethod('eSewa');
          }}>
          <Image
            source={require('../../assets/esewa.jpg')}
            style={
              selectedMethod === 'eSewa' ? styles.selectedIcon : styles.icon
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedMethod('Khalti')}>
          <Image
            source={require('../../assets/khalti.jpg')}
            style={
              selectedMethod === 'Khalti' ? styles.selectedIcon : styles.icon
            }
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={
          selectedMethod === 'eSewa'
            ? 'Enter your eSewa number'
            : 'Enter your Khalti number'
        }
        placeholderTextColor="black" // Placeholder text set to black
        keyboardType="default"
        onChangeText={text => setNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        placeholderTextColor="black" // Placeholder text set to black
        keyboardType="numeric"
        onChangeText={text => {
          setAmount(text);
        }}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handleWithdraw(selectedMethod)}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 95,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  icon: {
    width: 100,
    height: 45,
    marginHorizontal: 10,
    opacity: 0.8,
  },
  selectedIcon: {
    width: 120,
    height: 55,
    marginHorizontal: 10,
    opacity: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    padding: 10,
    marginTop: 39,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black', // Input text remains black
  },
  saveButton: {
    backgroundColor: '#007bff', // Blue button, common in your other code
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 39, // Matches input spacing
    height: 50,
    width: 100,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,

    textAlign: 'center',
  },
});

export default Withdraw;