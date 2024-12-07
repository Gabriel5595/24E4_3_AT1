import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

export default function ExchangeList({ exchange }) {
    const { simbolo, nomeFormatado, tipoMoeda, cotacaoCompra, cotacaoVenda, dataHoraCotacao } = exchange;

    const window = useWindowDimensions();
    const isLandscape = window.width > window.height;

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.simbolo}>{simbolo}</Text>
                <Text style={styles.nome}>{nomeFormatado}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.cotacao}>{`Compra: ${cotacaoCompra}`}</Text>
                {isLandscape && (
                    <View>
                        <Text style={styles.cotacao}>{`Venda: ${cotacaoVenda}`}</Text>
                        <Text style={styles.dataHora}>{`Cotação em: ${dataHoraCotacao}`}</Text>
                        <Text style={styles.tipo}>{`Tipo: ${tipoMoeda}`}</Text>
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
    simbolo: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10
    },
    nome: {
        flex: 2,
        fontSize: 16,
        color: '#555'
    },
    cotacao: {
        flex: 2,
        fontSize: 16,
        color: '#2e7d32'
    },
    dataHora: {
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
