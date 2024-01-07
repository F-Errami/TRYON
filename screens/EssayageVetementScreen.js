import React, { Suspense } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';



const Box = () => {
  useFrame(({ scene }) => {
    const box = scene.getObjectByName('box')
    box.rotation.x += 0.01
    box.rotation.y += 0.01
  });

  return (
    <mesh name='box'>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial color='blue'/>
    </mesh>
  )
}

const EssayageVetementScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Essayage Vêtement Screen</Text>
      <Suspense fallback={null}>
        <Canvas style={{ width: '100%', height: '100%' }}>
          <ambientLight />
          <pointLight position={[-1, 1, 1]} castShadow />
          <Box />
        </Canvas>
      </Suspense>
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
