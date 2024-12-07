import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TransacaoItemList from '../../components/transacaoItem';

export default function TransacaoListScreen({ transacoes }) {
    const dados = transacoes || [
        {
            id: '1',
            descricao: 'Compra Mercado',
            valor: 120.50,
            data: '2024-12-07',
            hora: '10:30',
            categoria: 'Alimentação',
            tipo: 'Despesa',
            moeda: 'BRL'
        },
        {
            id: '2',
            descricao: 'Salário',
            valor: 5000.00,
            data: '2024-12-05',
            hora: '09:00',
            categoria: 'Trabalho',
            tipo: 'Receita',
            moeda: 'BRL'
        }
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={dados}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransacaoItemList transacao={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    }
});
