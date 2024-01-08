import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * Composant Menu : Affiche le menu de navigation de l'application.
 * Permet de naviguer entre différentes sections.
 */
const Menu = () => {
  const navigation = useNavigation();

  // Fonctions de navigation vers différentes sections de l'application

  const navigateToReconstructionMorphologie = () => {
    navigation.navigate('Reconstruction Morphologie');
  };

  const navigateToReconstructionVetement = () => {
    navigation.navigate('Reconstruction Vêtement');
  };

  const navigateToEssayageVetement = () => {
    navigation.navigate('Essayage Vêtement');
  };

  const navigateToHomeScreen = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo-app.jpg')} style={styles.logo} />
        <TouchableOpacity onPress={navigateToHomeScreen}>
          <Text style={styles.appName}>TRYON</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuContent}>
        <TouchableOpacity style={styles.button} onPress={navigateToReconstructionMorphologie}>
          <Text style={styles.buttonText}>Reconstruction Morphologie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToReconstructionVetement}>
          <Text style={styles.buttonText}>Reconstruction Vêtement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToEssayageVetement}>
          <Text style={styles.buttonText}>Essayage Vêtement</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>© 2023 FHC de Telecom Saint-Étienne</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingLeft: 0,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    color: 'darkblue',
  },
  menuContent: {
    flex: 1,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 40,
    borderRadius: 0,
    width: '100%',
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    paddingLeft: 10,
  },
  copyrightContainer: {
    marginBottom: 10,
    padding: 10,
  },
  copyrightText: {
    fontSize: 12,
    color: 'darkblue',
    textAlign: 'center',
  },
});

export default Menu;
