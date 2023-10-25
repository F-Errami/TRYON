import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EssayageVetementScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Essayage Vêtement Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default EssayageVetementScreen;
