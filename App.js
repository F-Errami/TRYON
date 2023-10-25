// import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import ReconstructionMorphologieScreen from './screens/ReconstructionMorphologieScreen';
import ReconstructionVetementScreen from './screens/ReconstructionVetementScreen';
import EssayageVetementScreen from './screens/EssayageVetementScreen';
import Menu from './components/Menu';
import 'react-native-gesture-handler'
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <Menu {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Reconstruction Morphologie" component={ReconstructionMorphologieScreen} />
        <Drawer.Screen name="Reconstruction Vêtement" component={ReconstructionVetementScreen} />
        <Drawer.Screen name="Essayage Vêtement" component={EssayageVetementScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
