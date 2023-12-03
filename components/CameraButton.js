import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Modal, Image, StyleSheet, Pressable, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

const CameraButton = ({ onPhotoTaken }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, onChangeName] = React.useState('');

  const YourComponent = () => {
    const [permissionResponse, requestMediaPermission] = MediaLibrary.usePermissions();

    useEffect(() => {
      // You can check the current permission status here
      console.log('Permission Status:', permissionResponse.status);
    }, [permissionResponse]);

    const handlePermissionRequest = async () => {
      // Request permission when a button is pressed, for example
      const { status } = await requestMediaPermission();
      console.log('New Permission Status:', status);
    };
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      requestPermission = await mediaLibrary.req
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

  const saveToGallery = async (imageUri, imageName) => {
    handlePermissionRequest();
    if (imageUri) {
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      const album = await MediaLibrary.getAlbumAsync(imageName);
      if (album === null) {
        await MediaLibrary.createAlbumAsync(imageName, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    }
    console.log(imageName + ' hehe ' + imageUri)
  };

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const requestPermissions = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const mediaLibraryPermission = await Permissions.askAsync(requestPermission);

    console.log('Camera Permission Status:', cameraPermission.status);
    console.log('Media Library Permission Status:', permissionResponse);

    if (
      cameraPermission.status !== 'granted' ||
      mediaLibraryPermission.status !== 'granted'
    ) {
      console.error('Les autorisations nécessaires n\'ont pas été accordées.');
      return;
    }
    setHasPermission(mediaLibraryPermission.status === 'granted');
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
                <Text
                  style={styles.textStyle}> Veuillez entrer le nom de l'image
                </Text>
                <TextInput
                  style={styles.textStyle}
                  onChangeText={onChangeName}
                  value={name}
                  placeholder='nom'
                  placeholderTextColor={'gray'}
                />
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    Alert.alert(capturedImage.uri);
                    saveToGallery(capturedImage.uri, name);
                    validatePicture();
                    setModalVisible(false);
                  }}>
                  <Text style={styles.textStyle}>Valider</Text>
                </Pressable>
                <Pressable
                  style={[styles.button]}
                  onPress={() => setModalVisible(!isModalVisible)}>
                  <Text style={styles.textStyle}>Fermer</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
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
