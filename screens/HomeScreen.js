import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

const HomeScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/images/future_wallpaper.jpg')} // Replace with your background image
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={require('../assets/logo-app.jpg')} style={styles.logo} />
          <Text style={styles.explanation}>
            Welcome to TRYON, a computer vision project realized at Telecom Saint Etienne.
            TRYON allows you to virtually try on clothes and visualize how they look on you
            without actually trying them on. It's your virtual clothing fitting room!
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 }, // Adjust shadow offset for more depth
    shadowOpacity: 0.4, // Adjust shadow opacity for more visibility
    elevation: 4, // Android elevation for shadow
    alignItems: 'center',
    minHeight: 400, // Adjust card height as needed
  },
  logo: {
    width: 150, // Adjust the size as needed
    height: 150,
    marginBottom: 20,
  },
  explanation: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;
