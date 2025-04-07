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
import {BASE_URL, baseUrl} from '../../env';
import LoadingOverlay from '../../components/LoadingOverlay';

const DepositMoney = () => {
  const [selectedMethod, setSelectedMethod] = useState('eSewa');
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [Number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      if (Number.length != 10) {
        Alert.alert('Please enter a valid phone number');
        return;
      }

      setIsLoading(true);
      // Generate a proper filename with extension
      const timestamp = new Date().getTime();
      const filename = `payment_proof_${timestamp}.jpg`;

      const imageResponse = await axios.post(
        `${BASE_URL}/khelmela/upload/upload`,
        {
          image: base64Image,
          folderName: 'fileShare',
          filename: filename,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      console.log('Image response:', imageResponse.data);

      if (!imageResponse?.data?.url) {
        Alert.alert('Image upload failed');
        return;
      }

      const photoUrl = imageResponse.data.url;
      console.log(photoUrl);

      // after uploading Image , send Deposite Request

      const depositResponse = await axios.post(
        `${baseUrl}/khelmela/Deposite`,
        {
          amount: amount,
          Number: Number,
          selectedMethod: selectedMethod,
          image: photoUrl,
          date: Date.now(),
        },
        {
          headers: {Authorization: `${token}`},
        },
      );
      setIsLoading(false);
      Alert.alert(depositResponse.data.message);
    } catch (error) {
      console.error('Error:', error.response);
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {loading && (
          <Animated.View style={[styles.loadingBar, {width: progressWidth}]} />
        )}
        <InfoBox
          rules={'Write your username in the remark while depositing the money'}
        />
        <Text style={styles.heading}>Select Payment Method</Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={styles.methodItem}
            onPress={() => setSelectedMethod('eSewa')}>
            <Image
              source={require('../../assets/esewa.jpg')}
              style={
                selectedMethod === 'eSewa' ? styles.selectedIcon : styles.icon
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.methodItem}
            onPress={() => setSelectedMethod('Khalti')}>
            <Image
              source={require('../../assets/khalti.jpg')}
              style={
                selectedMethod === 'Khalti' ? styles.selectedIcon : styles.icon
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.qrContainer}>
          <Text style={styles.subHeading}>Pay on this QR</Text>
          <Image
            source={require('../../assets/scannerraiden.jpg')}
            style={styles.qrImage}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder={
            selectedMethod === 'eSewa'
              ? 'Enter your eSewa number'
              : 'Enter your Khalti number'
          }
          keyboardType="numeric"
          placeholderTextColor={'grey'}
          onChangeText={setNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          placeholderTextColor={'grey'}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={openGallery}>
          <AntDesign name="cloudupload" size={24} color="white" />
          <Text style={styles.uploadText}>Click here to upload Screenshot</Text>
        </TouchableOpacity>
        {selectedImage && (
          <View style={styles.uploadedImageContainer}>
            <Text style={styles.uploadedImageLabel}>Uploaded Screenshot:</Text>
            <Image source={{uri: selectedImage}} style={styles.uploadedImage} />
          </View>
        )}
        <TouchableOpacity style={styles.depositButton} onPress={handleDeposite}>
          <Text style={styles.depositText}>Deposit</Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay isVisible={isLoading} message={'एकै छिन् ल !'} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center content vertically
    paddingVertical: 20, // Add some vertical padding for better spacing
    backgroundColor: '#F2F2F2',
  },
  container: {
    flex: 1,
    alignItems: 'center', // Center items horizontally
    paddingHorizontal: 20, // Use horizontal padding instead of fixed width
  },
  loadingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 5,
    backgroundColor: 'blue',
    zIndex: 10, // Ensure it's above other elements
  },
  heading: {fontSize: 26, fontWeight: 'bold', marginTop: 20, color: 'Black'},
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute icons evenly
    marginTop: 30,
    width: '80%', // Adjust width as needed
  },
  methodItem: {
    alignItems: 'center',
  },
  icon: {width: 90, height: 40, opacity: 0.8, resizeMode: 'contain'},
  selectedIcon: {width: 110, height: 50, opacity: 1, resizeMode: 'contain'},
  qrContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  qrImage: {width: 150, height: 250, marginBottom: 30, borderRadius: 10},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    width: '80%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    color: 'black',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadText: {color: 'white', marginLeft: 10, fontSize: 16},
  depositButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 25,
  },
  depositText: {fontSize: 20, color: 'white', fontWeight: 'bold'},
  uploadedImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  uploadedImageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  uploadedImage: {width: 150, height: 150, borderRadius: 10},
});

export default DepositMoney;
