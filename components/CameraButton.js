import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Modal, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraButton = ({ onPhotoTaken }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };
  const validatePicture = () => {
    setIsCameraOpen(false);
    setCapturedImage(null);
  };
  

  return (
    <View>
      <Button title="Ouvrir la caméra" onPress={openCamera} />

      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : null}

      {capturedImage ? (
        <View>
          <Image source={{ uri: capturedImage.uri }} style={styles.capturedImage} />
          <View style={styles.capturedImageButtons}>
            <Button title="Valider" onPress={validatePicture} />
            <Button title="Reprendre" onPress={retakePicture} />
          </View>
        </View>
      ) : null}

      <Modal visible={isCameraOpen && !capturedImage} animationType="slide">
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={Camera.Constants.Type.back}
          />
          <View style={styles.captureButtonContainer}>
            <Button title="Prendre une photo" onPress={takePicture} />
            <Button title="Annuler" onPress={closeCamera} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  capturedImage: {
    width: 200,
    height: 200,
  },
  capturedImageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
});

export default CameraButton;
