import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CameraButton from '../components/CameraButton'; // Import the CameraButton component

const ReconstructionMorphologieScreen = () => {
  const onPhotoTaken = (photo) => {
    // Handle the captured photo here, e.g., save it, display it, etc.
  };

  return (
    <View style={styles.container}>
      <Text>Reconstruction Morphologie Screen</Text>

      <CameraButton onPhotoTaken={onPhotoTaken} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReconstructionMorphologieScreen;
