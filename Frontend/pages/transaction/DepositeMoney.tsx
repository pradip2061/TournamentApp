import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native';
import InfoBox from '../../components/InfoBox';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../../env';

const DepositMoney = () => {
  const [selectedMethod, setSelectedMethod] = useState('eSewa');
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [esewaNumber, setEsewaNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selected = response.assets[0];
        setSelectedImage(selected.uri);

        if (selected.base64) {
          setBase64Image(selected.base64);
          console.log('Base64 Image length:', selected.base64.length);
        } else {
          console.log('Response assets:', JSON.stringify(response.assets[0]));
          console.log('Base64 data not available in the selected image.');
          Alert.alert(
            'Error',
            'Base64 data not available in the selected image.',
          );
        }
      } else {
        console.log('Unexpected response format:', JSON.stringify(response));
        Alert.alert('Error', 'Failed to select image.');
      }
    });
  };
  const startLoadingAnimation = () => {
    progress.setValue(0);
    Animated.loop(
      Animated.timing(progress, {
        toValue: 100,
        duration: 5000,
        useNativeDriver: false,
      }),
    ).start();
  };

  const stopLoadingAnimation = () => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setLoading(false);
    });
  };
  const handleDeposite = async () => {
    setLoading(true);
    startLoadingAnimation();

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Token not found');
        return;
      }

      if (!base64Image) {
        Alert.alert('Please upload an image');
        return;
      }

      // Generate a proper filename with extension
      const timestamp = new Date().getTime();
      const filename = `payment_proof_${timestamp}.jpg`;

      const imageResponse = await axios.post(
        `${baseUrl}/khelmela/upload/upload/${token}`,
        {
          image: base64Image,
          filename: filename,
          folderName: 'Deposite', // Changed from 'Deposite' to match server-side check
          esewaNumber: {Number: esewaNumber}, // Match the format expected in server code
        },
      );

      console.log('Image response:', imageResponse.data);

      if (!imageResponse?.data?.url) {
        Alert.alert('Image upload failed');
        return;
      }

      const photoUrl = imageResponse.data.url;

      // after uploading Image , send Deposite Request

      const depositResponse = await axios.post(
        `${baseUrl}/khelmela/Deposite/${token}`,
        {
          amount: amount,
          esewaNumber: esewaNumber,
          selectedMethod: selectedMethod,
          image: photoUrl,
          date: Date.now(),
        },
      );

      Alert.alert(depositResponse.data.message);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message || error);
      Alert.alert(
        'Error',
        error.response?.data?.error || error.message || 'Something went wrong',
      );
    } finally {
      stopLoadingAnimation();
    }
  };
  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        {loading && (
          <Animated.View style={[styles.loadingBar, {width: progressWidth}]} />
        )}
        <InfoBox
          rules={'Write your username in the remark while depositing the money'}
        />
        <Text style={styles.heading}>Select Payment Method</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity onPress={() => setSelectedMethod('eSewa')}>
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

        <Text style={styles.subHeading}>Pay on this QR</Text>
        <Image
          source={require('../../assets/scannerraiden.jpg')}
          style={styles.qrImage}
        />

        <TextInput
          style={styles.input}
          placeholder={
            selectedMethod === 'eSewa'
              ? 'Enter your eSewa number'
              : 'Enter your Khalti number'
          }
          keyboardType="default"
          onChangeText={setEsewaNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={openGallery}>
          <AntDesign name="cloudupload" size={24} color="white" />
          <Text style={styles.uploadText}>Click here to upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.depositButton} onPress={handleDeposite}>
          <Text style={styles.depositText}>Deposit</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{uri: selectedImage}} style={styles.uploadedImage} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(0,18,64)',
  },
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 5,
    backgroundColor: 'blue',
  },
  heading: {fontSize: 26, fontWeight: 'bold', marginTop: 15, color: 'white'},
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 47,
    gap: 50,
  },
  icon: {width: 90, height: 40, opacity: 0.8},
  selectedIcon: {width: 110, height: 50, opacity: 1},
  subHeading: {fontSize: 18, fontWeight: 'bold', marginTop: 25, color: 'white'},
  qrImage: {width: 150, height: 250, marginBottom: 40},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  uploadText: {color: 'white', marginLeft: 5},
  depositButton: {
    width: 190,
    height: 40,
    backgroundColor: 'rgb(96,187,70)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  depositText: {fontSize: 21, color: 'white'},
  uploadedImage: {width: 200, height: 200, marginTop: 20, borderRadius: 10},
});

export default DepositMoney;
