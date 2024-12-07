import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Picker } from '@react-native-picker/picker';
import TransacaoItemList from '../../components/TransacaoItemList';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TransacaoListScreen() {
    const [sortOption, setSortOption] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [dados, setDados] = useState([]);
    const navigation = useNavigation();

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

    const deleteTransaction = async (transactionId) => {
        try {
            Alert.alert(
                'Confirmar Deleção',
                'Você tem certeza que deseja deletar esta transação?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Deletar', onPress: async () => {
                            const transacoesJSON = await AsyncStorage.getItem('transacoes');
                            let transacoes = transacoesJSON ? JSON.parse(transacoesJSON) : [];
                            transacoes = transacoes.filter(item => item.id !== transactionId);
                            await AsyncStorage.setItem('transacoes', JSON.stringify(transacoes));
                            carregarTransacoes();
                            Alert.alert('Sucesso', 'Transação deletada com sucesso!');
                        }, style: 'destructive'
                    },
                ],
                { cancelable: true }
            );
        } catch (error) {
            console.error('Erro ao deletar transação:', error);
            Alert.alert('Erro', 'Não foi possível deletar a transação.');
        }
    };

    const editTransaction = (transaction) => {
        navigation.navigate('AdicionarTransacao', { isNew: false, transactionId: transaction.id });
    };

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

            <SwipeListView
                data={dados}
                keyExtractor={item => item.id}
                renderItem={(data) => (
                    <TransacaoItemList transacao={data.item} />
                )}
                renderHiddenItem={(data, rowMap) => (
                    <View style={styles.rowBack}>
                        <TouchableOpacity
                            style={[styles.backLeftBtn, styles.backBtn]}
                            onPress={() => editTransaction(data.item)}
                        >
                            <Ionicons name="create-outline" size={25} color="#fff" />
                            <Text style={styles.backTextWhite}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.backRightBtn, styles.backBtn]}
                            onPress={() => deleteTransaction(data.item.id)}
                        >
                            <Ionicons name="trash-outline" size={25} color="#fff" />
                            <Text style={styles.backTextWhite}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                leftOpenValue={75}
                rightOpenValue={-75}
                disableRightSwipe={false}
                stopLeftSwipe={150}
                stopRightSwipe={-150}
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 75,
        height: '100%',
    },
    backLeftBtn: {
        backgroundColor: '#1f65ff', // Azul para editar
        position: 'absolute',
        left: 0,
    },
    backRightBtn: {
        backgroundColor: '#FF3B30', // Vermelho para deletar
        position: 'absolute',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
        fontSize: 12,
        marginTop: 5
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});
