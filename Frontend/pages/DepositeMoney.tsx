import React, { useRef, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet,Animated, Alert} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ScrollView } from "react-native";
import InfoBox from "../components/InfoBox";
import { launchImageLibrary } from "react-native-image-picker";
const DepositMoney = () => {
  const [selectedMethod, setSelectedMethod] = useState("eSewa");
  const [selectedImage, setSelectedImage] = useState(null);
  const[esewaNumber,setEsewaNumber]=useState('')
  const[amount,setAmount]=useState('')
  const[loading,setLoading]=useState(false)
console.log(selectedImage)
  const openGallery=()=>{
    const options = {
      mediaType: "photo",
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        setSelectedImage(response.assets[0].uri); // Set the selected image
      }
    });
  }
  
  const progress = useRef(new Animated.Value(0)).current;

  const startLoadingAnimation = () => {
    progress.setValue(0);
    Animated.loop(
      Animated.timing(progress, {
        toValue: 100,
        duration: 5000, // The bar moves in 5 seconds, but can be stopped anytime
        useNativeDriver: false,
      })
    ).start();
  };

  const stopLoadingAnimation = () => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 300, // Smoothly completes if API response comes earlier
      useNativeDriver: false,
    }).start(() => {
      setLoading(false); // Hide loading bar after animation completes
    });
  };
  const handleLogin = async () => {
    setLoading(true);
    startLoadingAnimation();
    try {
      stopLoadingAnimation()
    } catch (error) {
      stopLoadingAnimation();
      Alert.alert("Login failed. Please check credentials.");
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"], // Animates width from 0 to full screen
  });
  const rules ="write your username in the remark while depositing the money"
  return (
    <ScrollView>
    <View style={styles.container}>
    {loading && <Animated.View style={[styles.loadingBar, { width: progressWidth }]} />}
     <InfoBox rules={rules}/>
      <Text style={styles.heading}>Select Payment Method</Text>
      <View style={styles.methodContainer}>
        <TouchableOpacity onPress={() => setSelectedMethod("eSewa")}>
          <Image
            source={require("../assets/esewa.jpg")}
            style={selectedMethod === "eSewa" ? styles.selectedIcon : styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedMethod("Khalti")}>
          <Image
            source={require("../assets/khalti.jpg")}
            style={selectedMethod === "Khalti" ? styles.selectedIcon : styles.icon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeading}>Pay on this QR</Text>
      <Image source={require("../assets/scannerraiden.jpg")} style={styles.qrImage} />

      <TextInput
        style={styles.input}
        placeholder={selectedMethod === "eSewa" ? "Enter your eSewa number" : "Enter your Khalti number"}
        keyboardType="default"
        onChangeText={(text)=>setEsewaNumber(text)}
      />
      <TextInput style={styles.input} placeholder="Enter Amount" keyboardType="numeric" onChangeText={(text)=>setAmount(text)} />

      <TouchableOpacity style={styles.uploadButton} onPress={openGallery}>
        <AntDesign name="cloud-upload-outline" size={24} color="white" />
        <Text style={styles.uploadText}>Click here to upload</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{width:190,height:40,backgroundColor:'rgb(96,187,70)',alignItems:'center',justifyContent:'center',marginTop:20}}>
        <Text style={{fontSize:21,color:'white'}}>Save</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
        />
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 ,backgroundColor:'rgb(0,18,64)'
  },
  loadingBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 5,
    backgroundColor: "blue",
  },
  note: { color: "red",marginLeft:30 },
  bold: { fontWeight: "bold" },
  heading: { fontSize: 26, fontWeight: "bold", marginTop: 15,color:'white' },
  methodContainer: { flexDirection: "row", justifyContent: "center", marginTop: 47 ,gap:50},
  icon: { width: 90, height: 40, marginHorizontal: 10, opacity: 0.8 },
  selectedIcon: { width: 110, height: 50, marginHorizontal: 10, opacity: 1 },
  subHeading: { fontSize: 18, fontWeight: "bold", marginTop: 25,color:'white'},
  qrImage: { width: 150, height: 250, marginBottom: 40 },
  input: { borderWidth: 1, borderColor: "#ccc",backgroundColor:'white', width: "80%", padding: 10, marginBottom: 20, borderRadius: 5 },
  uploadButton: { flexDirection: "row", alignItems: "center", backgroundColor: "blue", padding: 10, borderRadius: 5 },
  uploadText: { color: "white", marginLeft: 5 },
});

export default DepositMoney;