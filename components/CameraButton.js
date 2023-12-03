import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Modal, Image, StyleSheet, Pressable, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

const CameraButton = ({ onPhotoTaken }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, onChangeName] = useState('');
  const [capturedImageName, setCapturedImageName] = useState('');

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasPermission(
        cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted'
      );
    };

    (async () => {
      await requestPermissions();
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

  const saveToGallery = async (imageUri, imageName) => {
    try {
      const newPath = `${FileSystem.documentDirectory}${imageName}.jpg`;

      // Move or copy the file to the desired path
      await FileSystem.moveAsync({
        from: imageUri,
        to: newPath,
      });

      // Create asset from the new path
      const asset = await MediaLibrary.createAssetAsync(newPath);
      const album = await MediaLibrary.getAlbumAsync("Face");

      if (album === null) {
        await MediaLibrary.createAlbumAsync("Face", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleCameraType = () => {
    setType((currentType) =>
      currentType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.button}>
        <Pressable style={styles.button} onPress={openCamera}>
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
            <Button title="Valider" onPress={() => setModalVisible(true)} />
            <Button title="Reprendre" onPress={retakePicture} />
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(!isModalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.textStyle}>Veuillez entrer le nom de l'image</Text>
                <TextInput
                  style={styles.textStyle}
                  onChangeText={(text) => onChangeName(text) && setCapturedImageName(text)}
                  value={name}
                  placeholder="nom"
                  placeholderTextColor="gray"
                />
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    saveToGallery(capturedImage.uri, capturedImageName);
                    validatePicture();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.textStyle}>Valider</Text>
                </Pressable>
                <Pressable
                  style={[styles.button]}
                  onPress={() => setModalVisible(!isModalVisible)}
                >
                  <Text style={styles.textStyle}>Fermer</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}

      <Modal visible={isCameraOpen && !capturedImage} animationType="slide">
        <View style={styles.cameraContainer}>
          <Camera ref={cameraRef} style={styles.camera} type={type} />
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
  modalView: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#00BFFF',
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    elevation: 30,
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
