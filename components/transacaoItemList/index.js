import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

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

    const window = useWindowDimensions();
    const isLandscape = window.width > window.height;

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.descricao}>{descricao}</Text>
                <Text style={styles.valor}>{`${valor} ${moeda}`}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.data}>{`Data: ${data}`}</Text>
                {isLandscape && (
                    <View>
                        <Text style={styles.hora}>{`Hora: ${hora}`}</Text>
                        <Text style={styles.categoria}>{`Categoria: ${categoria}`}</Text>
                        <Text style={styles.tipo}>{`Tipo: ${tipo}`}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: '#f9f9f9'
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5
    },
    descricao: {
        flex: 2,
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10
    },
    valor: {
        flex: 1,
        fontSize: 16,
        color: '#2e7d32'
    },
    data: {
        flex: 2,
        color: '#555'
    },
    hora: {
        flex: 1,
        color: '#555',
        marginLeft: 10
    },
    categoria: {
        flex: 1,
        color: '#555',
        marginLeft: 10
    },
    tipo: {
        flex: 1,
        color: '#555',
        marginLeft: 10
    }
});
