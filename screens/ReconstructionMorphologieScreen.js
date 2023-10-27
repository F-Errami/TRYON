
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert, Pressable } from 'react-native';
import CameraButton from '../components/CameraButton'; // Import the CameraButton component

const ReconstructionMorphologieScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const onPhotoTaken = (photo) => {
    // Handle the captured photo here, e.g., save it, display it, etc.
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
          hideModal();
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Voici les instructions pour ajouter une nouvelle morphologie!</Text>
          <Text style={styles.modalText}>- Prends une photo de ton visage</Text>
          <Text style={styles.modalText}>- Mets tes mesures dans le formulaire </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Fermer</Text>
          </Pressable>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}> ? </Text>
      </Pressable>

      <CameraButton onPhotoTaken={onPhotoTaken} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    position:'absolute',
    top:0,
    right:0,
    backgroundColor: '#da70d6',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ReconstructionMorphologieScreen;
