import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import ExchangeAPI from '../../api/ExchangeAPI';

export default function AddTransactionScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [isNew, setIsNew] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [categoria, setCategoria] = useState('');
    const [tipo, setTipo] = useState('Receita');
    const [moeda, setMoeda] = useState('');
    const [moedas, setMoedas] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        const fetchTransactionAndMoedas = async () => {
            try {
                const listaMoedas = await ExchangeAPI.obterListaDeMoedas();
                setMoedas(listaMoedas);

                if (route.params && route.params.transactionId) {
                    setIsNew(false);
                    const transacoesJSON = await AsyncStorage.getItem('transacoes');
                    const transacoes = transacoesJSON ? JSON.parse(transacoesJSON) : [];
                    const transaction = transacoes.find(item => item.id === route.params.transactionId);

                    if (transaction) {
                        // Preenche os campos do formulário
                        setDescricao(transaction.descricao);
                        setValor(String(transaction.valor));
                        setData(new Date(transaction.data));
                        setHora(parseTime(transaction.hora));
                        setCategoria(transaction.categoria);
                        setTipo(transaction.tipo);
                        setMoeda(transaction.moeda);
                    } else {
                        Alert.alert('Erro', 'Transação não encontrada.');
                        navigation.navigate('Transacoes');
                    }
                } else {
                    resetForm();
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                Alert.alert('Erro', 'Não foi possível carregar os dados.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionAndMoedas();
    }, [route.params]);

    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        return date;
    };

    const handleSubmit = async () => {
        if (!descricao || !valor || !categoria || !moeda) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const novaTransacao = {
            descricao,
            valor: parseFloat(valor),
            data: data.toISOString().split('T')[0],
            hora: hora.toTimeString().split(' ')[0].substring(0, 5), // HH:MM
            categoria,
            tipo,
            moeda,
        };

        try {
            const transacoesJSON = await AsyncStorage.getItem('transacoes');
            let transacoes = transacoesJSON ? JSON.parse(transacoesJSON) : [];

            if (!isNew) {
                transacoes = transacoes.map(item =>
                    item.id === route.params.transactionId ? { ...item, ...novaTransacao } : item
                );
                Alert.alert('Sucesso', 'Transação atualizada com sucesso!');
            } else {
                const novaTransacaoComId = { id: Date.now().toString(), ...novaTransacao };
                transacoes.push(novaTransacaoComId);
                Alert.alert('Sucesso', 'Transação adicionada com sucesso!');
            }

            await AsyncStorage.setItem('transacoes', JSON.stringify(transacoes));
            resetForm();
            navigation.navigate('Transacoes');
        } catch (error) {
            console.error('Erro ao adicionar/editar transação:', error);
            Alert.alert('Erro', 'Não foi possível salvar a transação.');
        }
    };

    const resetForm = () => {
        setDescricao('');
        setValor('');
        setData(new Date());
        setHora(new Date());
        setCategoria('');
        setTipo('Receita');
        setMoeda('');
        setIsNew(true);
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setData(selectedDate);
        }
    };

    const onChangeTime = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setHora(selectedTime);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
                style={styles.input}
                placeholder="Descrição da transação"
                value={descricao}
                onChangeText={setDescricao}
            />

            <Text style={styles.label}>Valor:</Text>
            <TextInput
                style={styles.input}
                placeholder="Valor"
                value={valor}
                onChangeText={setValor}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Data:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                <Text>{data.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={data}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            <Text style={styles.label}>Hora:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePicker}>
                <Text>{hora.toTimeString().split(' ')[0].substring(0, 5)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={hora}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                />
            )}

            <Text style={styles.label}>Categoria:</Text>
            <TextInput
                style={styles.input}
                placeholder="Categoria"
                value={categoria}
                onChangeText={setCategoria}
            />

            <Text style={styles.label}>Tipo:</Text>
            <Picker
                selectedValue={tipo}
                style={styles.picker}
                onValueChange={(itemValue) => setTipo(itemValue)}
            >
                <Picker.Item label="Receita" value="Receita" />
                <Picker.Item label="Despesa" value="Despesa" />
            </Picker>

            <Text style={styles.label}>Moeda:</Text>
            <Picker
                selectedValue={moeda}
                style={styles.picker}
                onValueChange={(itemValue) => setMoeda(itemValue)}
            >
                <Picker.Item label="Selecione uma moeda" value="" />
                {moedas.map((m) => (
                    <Picker.Item key={m.simbolo} label={`${m.nomeFormatado} (${m.simbolo})`} value={m.simbolo} />
                ))}
            </Picker>

            <View style={styles.buttonContainer}>
                <Button title={isNew ? "Adicionar Transação" : "Atualizar Transação"} onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    buttonContainer: {
        marginTop: 30,
    },
    datePicker: {
        height: 40,
        justifyContent: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
