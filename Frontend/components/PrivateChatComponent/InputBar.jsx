import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const InputBar = ({
  newMessage,
  setNewMessage,
  inputHeight,
  setInputHeight,
  selectedPhoto,
  setSelectedPhoto,
  isUploading,
  selectPhoto,
  uploadAndSendPhoto,
  sendTextMessage,
}) => {
  return (
    <>
      {selectedPhoto && (
        <View style={styles.selectedPhotoContainer}>
          <Image
            source={{uri: selectedPhoto.uri}}
            style={styles.selectedPhotoPreview}
          />
          <TouchableOpacity
            style={styles.cancelPhotoButton}
            onPress={() => setSelectedPhoto(null)}>
            <Text style={styles.cancelPhotoText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={selectPhoto}
          activeOpacity={0.7}>
          <Text style={styles.photoButtonText}>📷</Text>
        </TouchableOpacity>

        {selectedPhoto ? (
          <TouchableOpacity
            style={[styles.sendButton, isUploading && styles.disabledButton]}
            onPress={uploadAndSendPhoto}
            disabled={isUploading}
            activeOpacity={0.7}>
            {isUploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Send Photo</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={[styles.input, {height: Math.min(inputHeight, 100)}]}
              placeholder="Type a message..."
              value={newMessage}
              placeholderTextColor={'#8E8E92'}
              onChangeText={setNewMessage}
              multiline
              onContentSizeChange={e =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !newMessage.trim() && styles.disabledButton,
              ]}
              onPress={sendTextMessage}
              disabled={!newMessage.trim()}
              activeOpacity={0.7}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F4F4F5',
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  photoButton: {
    padding: 10,
    backgroundColor: '#075e54',
    borderRadius: 20,
    marginRight: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    color: 'black',
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#075e54',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  selectedPhotoContainer: {
    backgroundColor: '#F4F4F5',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'relative',
  },
  selectedPhotoPreview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  cancelPhotoButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelPhotoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default InputBar;
