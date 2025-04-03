import Sound from 'react-native-sound';

const playNotificationSound = () => {
  const sound = new Sound(require('../assets/globalNotify.wav'), error => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
    sound.play();
  });
};

export default playNotificationSound;
