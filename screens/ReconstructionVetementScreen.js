import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import VideoButton from '../components/VideoButton';


/**
  * Cette méthode permet de capturer une vidéo et de la visionner.
  * L'objectif est d'utiliser cette vidéo ultérieurement pour reconstruire l'objet à partir d'angles différents.
 */

const ReconstructionVetementScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const onVideoTaken = (video) => {
    // Méthode créee pour traiter la vidéo prise ultérieurement
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
          <Text style={styles.modalText}>Voici les instructions pour ajouter un nouveau objet!</Text>
          <Text style={styles.modalText}>- Prends une photo de ton objet sous un angle de </Text>
          <Text style={styles.modalText}>- Prends une autre photo de ton objet mais sous un angle de  </Text>
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
        <VideoButton onVideoTaken={onVideoTaken} />
      </View> 
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

export default ReconstructionVetementScreen;
