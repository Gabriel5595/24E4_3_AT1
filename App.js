import React from 'react';
import { StyleSheet, View } from 'react-native';
import TransacaoListScreen from './screens/TransacaoListScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <TransacaoListScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1
  }
});
