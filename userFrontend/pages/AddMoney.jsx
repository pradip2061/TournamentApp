import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {IP, SERVER_PORT} from '../env';

const AddMoney = ({userId = '67b172f25619a0dd393e6c6c'}) => {
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState('');
  const [image, setImage] = useState('');
  const net = userId;

  console.log(`${IP}:${SERVER_PORT}/money/Addmoney`);
  const handleAddMoney = () => {
    if (amount <= 0 || !remark) {
      Alert.alert('Please set Amount and Remark');
    } else {
      console.log(net);
      if (amount < 50) {
        Alert.alert('Minimum amount is 50');
      } else {
        const fetch = async () => {
          try {
            const response = await axios.post(
              `${IP}:${SERVER_PORT}/money/Addmoney`,
              {
                senderId: userId,
                amount: amount,
                remark: remark,
                image: image,
              },
            );
            Alert.alert(response.data);
          } catch (error) {
            Alert.alert(error);
            console.log(error);
          }
        };
        fetch();
        console.log('moved forward ', amount, remark);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Money</Text>
      <View style={styles.image}>
        <Text
          style={[styles.header, {color: 'white', fontSize: 40, padding: 12}]}>
          +
        </Text>
      </View>
      <TextInput
        placeholder="Enter Amount"
        style={styles.input}
        keyboardType="numeric" // Ensure proper input value binding
        onChangeText={value => setAmount(Number(value))} // Correct event handler
      />
      <Text style={styles.note}>
        Note: The Remark should be your Game Name same as you set in e-sewa
      </Text>

      <TextInput
        placeholder="Remark"
        style={styles.input}
        value={remark}
        onChangeText={value => setRemark(value)} // Correctly update remark
      />
      <TouchableOpacity style={styles.button} onPress={handleAddMoney}>
        <Text style={styles.buttontext}>Add Money</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 20,
    borderRadius: 10,
    borderColor: 'black',
  },
  note: {
    marginTop: 20,
    fontSize: 10,
    color: 'red',
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    width: 120,
    height: 40,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttontext: {
    color: 'white',
    fontSize: 14,
  },
});

export default AddMoney;
