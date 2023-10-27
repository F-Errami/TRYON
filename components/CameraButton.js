import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Modal, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const CameraButton = ({ onPhotoTaken }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);

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
    requestPermissions();
    saveToGallery(capturedImage.uri);
  };

  const saveToGallery = async (imageUri) => {

    if (imageUri) {
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      const album = await MediaLibrary.getAlbumAsync('Nom de l\'album');
      if (album === null) {
        await MediaLibrary.createAlbumAsync('Nom de l\'album', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    }
  };

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const requestPermissions = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const mediaLibraryPermission = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (
      cameraPermission.status !== 'granted' ||
      mediaLibraryPermission.status !== 'granted'
    ) {
      console.error('Les autorisations nécessaires n\'ont pas été accordées.');
      return;
    }
    setHasPermission(mediaLibraryPermission === 'granted');
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.button}>
        <Pressable
          style={styles.button}
          onPress={openCamera}>
          <Text style={styles.textStyle}>Ouvrir la caméra</Text>
        </Pressable>
      </View>
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
            type={type}
          />
          <View style={styles.captureButtonContainer}>
            <Button title="Prendre une photo" onPress={takePicture} />
            <Button title="Annuler" onPress={closeCamera} />
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.textStyle}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  button: {
    borderRadius: 20,
    padding: 5,
    marginTop: 3,
    backgroundColor: '#da70d6',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CameraButton;
