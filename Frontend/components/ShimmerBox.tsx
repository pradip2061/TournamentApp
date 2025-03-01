import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerBox = () => {
  const shimmerAnimation = new Animated.Value(0);

  // Animating the shimmer effect
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        {/* First Shimmer Box */}
        <LinearGradient
          colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
          style={styles.shimmerBox}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View
            style={[
              styles.shimmerEffect,
              {
                transform: [
                  {
                    translateX: shimmerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-300, 300], // Controls the shimmer direction
                    }),
                  },
                ],
              },
            ]}
          />
        </LinearGradient>

        {/* Second Shimmer Box */}
        <LinearGradient
          colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
          style={styles.shimmerBox}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View
            style={[
              styles.shimmerEffect,
              {
                transform: [
                  {
                    translateX: shimmerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-300, 300], // Controls the shimmer direction
                    }),
                  },
                ],
              },
            ]}
          />
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20
  },
  boxContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  shimmerBox: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  shimmerEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
});

export default ShimmerBox;
