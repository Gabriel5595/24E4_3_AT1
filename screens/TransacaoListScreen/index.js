import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TransacaoItemList from '../../components/TransacaoItemList';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransacaoListScreen({ navigation }) {
    const [sortOption, setSortOption] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [dados, setDados] = useState([]);

    const ordenarDados = (dadosParaOrdenar, criterio) => {
        let dadosOrdenados = [...dadosParaOrdenar];
        if (criterio === 'descricao') {
            dadosOrdenados.sort((a, b) => a.descricao.localeCompare(b.descricao));
        } else if (criterio === 'valor') {
            dadosOrdenados.sort((a, b) => a.valor - b.valor);
        } else if (criterio === 'data') {
            dadosOrdenados.sort((a, b) => new Date(a.data) - new Date(b.data));
        } else if (criterio === 'hora') {
            dadosOrdenados.sort((a, b) => {
                const [horaA, minutoA] = a.hora.split(':').map(Number);
                const [horaB, minutoB] = b.hora.split(':').map(Number);
                return horaA === horaB ? minutoA - minutoB : horaA - horaB;
            });
        } else if (criterio === 'categoria') {
            dadosOrdenados.sort((a, b) => a.categoria.localeCompare(b.categoria));
        } else if (criterio === 'tipo') {
            dadosOrdenados.sort((a, b) => a.tipo.localeCompare(b.tipo));
        } else if (criterio === 'moeda') {
            dadosOrdenados.sort((a, b) => a.moeda.localeCompare(b.moeda));
        }
        return dadosOrdenados;
    };

    const filtrarDados = (dadosParaFiltrar, criterio) => {
        if (criterio === 'Receita') {
            return dadosParaFiltrar.filter(item => item.tipo === 'Receita');
        } else if (criterio === 'Despesa') {
            return dadosParaFiltrar.filter(item => item.tipo === 'Despesa');
        }
        return dadosParaFiltrar;
    };

    const carregarTransacoes = async () => {
        try {
            const transacoesJSON = await AsyncStorage.getItem('transacoes');
            const transacoes = transacoesJSON ? JSON.parse(transacoesJSON) : [];
            let dadosProcessados = [...transacoes];

            dadosProcessados = filtrarDados(dadosProcessados, filterOption);

            if (sortOption !== '') {
                dadosProcessados = ordenarDados(dadosProcessados, sortOption);
            }

            setDados(dadosProcessados);
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            Alert.alert('Erro', 'Não foi possível carregar as transações.');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            carregarTransacoes();
        });

        return unsubscribe;
    }, [navigation, sortOption, filterOption]);

    return (
        <View style={styles.container}>
            <View style={styles.controlSection}>
                <Text style={styles.controlLabel}>Ordenar por:</Text>
                <Picker
                    selectedValue={sortOption}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSortOption(itemValue)}
                >
                    <Picker.Item label="Nenhum" value="" />
                    <Picker.Item label="Descrição" value="descricao" />
                    <Picker.Item label="Valor (crescente)" value="valor" />
                    <Picker.Item label="Data (crescente)" value="data" />
                    <Picker.Item label="Hora (crescente)" value="hora" />
                    <Picker.Item label="Categoria" value="categoria" />
                    <Picker.Item label="Tipo" value="tipo" />
                    <Picker.Item label="Moeda" value="moeda" />
                </Picker>
            </View>

            <View style={styles.controlSection}>
                <Text style={styles.controlLabel}>Filtrar por Tipo:</Text>
                <Picker
                    selectedValue={filterOption}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFilterOption(itemValue)}
                >
                    <Picker.Item label="Todos" value="" />
                    <Picker.Item label="Receita" value="Receita" />
                    <Picker.Item label="Despesa" value="Despesa" />
                </Picker>
            </View>

            <View style={styles.resetButton}>
                <Button
                    title="Resetar Filtros e Ordenação"
                    onPress={() => {
                        setSortOption('');
                        setFilterOption('');
                    }}
                />
            </View>

            <FlatList
                data={dados}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransacaoItemList transacao={item} />}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
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
    controlSection: {
        marginBottom: 10
    },
    controlLabel: {
        fontSize: 16,
        marginBottom: 5
    },
    picker: {
        height: 50,
        width: '100%'
    },
    resetButton: {
        marginBottom: 10
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});
