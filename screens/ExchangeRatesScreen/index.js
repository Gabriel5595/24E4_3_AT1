import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import ExchangeList from '../../components/ExchangeList';
import ExchangeAPI from '../../api/ExchangeAPI';

export default function ExchangeRatesScreen() {
    const [exchangeData, setExchangeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const moedas = await ExchangeAPI.obterListaDeMoedas();
                const dataCotacoes = await Promise.all(
                    moedas.map(async (moeda) => {
                        try {
                            const cotacao = await ExchangeAPI.obterCotacaoPorData(moeda.simbolo, getTodayDate());
                            return {
                                simbolo: moeda.simbolo,
                                nomeFormatado: moeda.nomeFormatado,
                                tipoMoeda: moeda.tipoMoeda,
                                cotacaoCompra: cotacao.cotacaoCompra,
                                cotacaoVenda: cotacao.cotacaoVenda,
                                dataHoraCotacao: cotacao.dataHoraCotacao,
                            };
                        } catch (err) {
                            console.error(`Erro ao obter cotação para ${moeda.simbolo}:`, err);
                            return {
                                simbolo: moeda.simbolo,
                                nomeFormatado: moeda.nomeFormatado,
                                tipoMoeda: moeda.tipoMoeda,
                                cotacaoCompra: 'N/A',
                                cotacaoVenda: 'N/A',
                                dataHoraCotacao: 'N/A',
                            };
                        }
                    })
                );
                setExchangeData(dataCotacoes);
            } catch (err) {
                console.error('Erro ao buscar dados de câmbio:', err);
                setError('Não foi possível carregar os dados de câmbio.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchExchangeRates();
    }, []);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        Alert.alert('Erro', error, [{ text: 'OK' }]);
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={exchangeData}
                keyExtractor={(item) => item.simbolo}
                renderItem={({ item }) => <ExchangeList exchange={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center'
    }
});
