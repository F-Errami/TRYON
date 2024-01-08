import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import CameraButton from '../components/CameraButton'; 
import Formulaire from './Formulaire';

// Méthode permettant à l'utilisateur d'ouvrir la caméra ainsi que le formulaire pour renseigner ses mesures.

const ReconstructionMorphologieScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [submittedFormData,setSubmittedFormData] = useState(null);

  const handleFormClose = (value) => {
    setFormVisible(value);
  };

  const onPhotoTaken = (photo) => {
    // Méthode créee pour traiter l'image prise ultérieurement
  };

  const handleFormSubmit = (data) => {
    console.log('Data from Form:', data);
    setSubmittedFormData(data);
    setFormVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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

      <View>
        <CameraButton onPhotoTaken={onPhotoTaken} />
      </View>

      <Pressable
        style={[styles.buttonForm]}
        onPress={() => setFormVisible(true)}>
        <Text style={styles.textStyle}> Ajouter une morphologie </Text>
      </Pressable>
      <Formulaire formVisible={formVisible} onCloseForm={handleFormClose} onSubmit={handleFormSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    flexDirection: 'row',
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
    position: 'absolute',
    top: 0,
    right: 0,
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
  buttonForm: {
    borderRadius: 20,
    padding: 12,
    marginTop: 3,
    marginLeft: 20, 
    backgroundColor: '#da70d6',
  },
});

export default ReconstructionMorphologieScreen;
