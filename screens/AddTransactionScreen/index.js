import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TransactionForm from '../../components/TransactionForm';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTransactionScreen({ navigation }) {

    const handleAddTransaction = async (novaTransacao) => {
        try {
            const transacoesJSON = await AsyncStorage.getItem('transacoes');
            const transacoes = transacoesJSON ? JSON.parse(transacoesJSON) : [];
            const novaTransacaoComId = { id: Date.now().toString(), ...novaTransacao };
            const transacoesAtualizadas = [...transacoes, novaTransacaoComId];
            await AsyncStorage.setItem('transacoes', JSON.stringify(transacoesAtualizadas));
            Alert.alert('Sucesso', 'Transação adicionada com sucesso!');
            navigation.navigate('Transacoes');
        } catch (error) {
            console.error('Erro ao adicionar transação:', error);
            Alert.alert('Erro', 'Não foi possível adicionar a transação.');
        }
    };

    return (
        <View style={styles.container}>
            <TransactionForm onSubmit={handleAddTransaction} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
});