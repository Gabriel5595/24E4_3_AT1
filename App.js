import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import AuthenticationScreen from './screens/AuthenticationScreen';
import TransacaoListScreen from './screens/TransacaoListScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authentication">
        <Stack.Screen
          name="Authentication"
          component={AuthenticationScreen}
          options={{ title: 'Autenticação' }}
        />
        <Stack.Screen
          name="Transacoes"
          component={TransacaoListScreen}
          options={{ title: 'Lista de Transações' }}
        />
        <Stack.Screen
          name="AdicionarTransacao"
          component={AddTransactionScreen}
          options={{ title: 'Adicionar Transação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});