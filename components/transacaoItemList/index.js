import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransacaoItemList({ transacao }) {
    return (
        <View style={styles.rowFront}>
            <View style={styles.itemContainer}>
                <Text style={styles.descricao}>{transacao.descricao}</Text>
                <Text style={styles.valor}>{transacao.valor.toFixed(2)}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.categoria}>{transacao.categoria}</Text>
                <Text style={styles.tipo}>{transacao.tipo}</Text>
                <Text style={styles.moeda}>{transacao.moeda}</Text>
                <Text style={styles.dataHora}>{`${transacao.data} ${transacao.hora}`}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rowFront: {
        backgroundColor: '#FFF',
        borderBottomColor: '#CCC',
        borderBottomWidth: 1,
        padding: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    descricao: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    valor: {
        fontSize: 16,
        color: '#2e7d32',
    },
    detailsContainer: {
        marginTop: 5,
    },
    categoria: {
        fontSize: 14,
        color: '#555',
    },
    tipo: {
        fontSize: 14,
        color: '#555',
    },
    moeda: {
        fontSize: 14,
        color: '#555',
    },
    dataHora: {
        fontSize: 12,
        color: '#777',
    },
});
