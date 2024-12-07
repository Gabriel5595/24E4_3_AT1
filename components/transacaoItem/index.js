import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransacaoItemList({ transacao }) {
    const {
        descricao,
        valor,
        data,
        hora,
        categoria,
        tipo,
        moeda
    } = transacao;

    return (
        <View style={styles.container}>
            <Text style={styles.descricao}>{descricao}</Text>
            <Text>{`Valor: ${valor} ${moeda}`}</Text>
            <Text>{`Data: ${data}`}</Text>
            <Text>{`Hora: ${hora}`}</Text>
            <Text>{`Categoria: ${categoria}`}</Text>
            <Text>{`Tipo: ${tipo}`}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10
    },
    descricao: {
        fontWeight: 'bold',
        marginBottom: 5
    }
});
