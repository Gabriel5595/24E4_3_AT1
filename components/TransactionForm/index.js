import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ExchangeAPI from '../../api/ExchangeAPI';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TransactionForm({ onSubmit }) {
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
        const fetchMoedas = async () => {
            try {
                const listaMoedas = await ExchangeAPI.obterListaDeMoedas();
                setMoedas(listaMoedas);
            } catch (error) {
                console.error('Erro ao buscar moedas:', error);
                Alert.alert('Erro', 'Não foi possível carregar a lista de moedas.');
            }
        };

        fetchMoedas();
    }, []);

    const handleSubmit = () => {
        if (!descricao || !valor || !categoria || !moeda) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const novaTransacao = {
            descricao,
            valor: parseFloat(valor),
            data: data.toISOString().split('T')[0],
            hora: hora.toTimeString().split(' ')[0].substring(0,5),
            categoria,
            tipo,
            moeda,
        };

        onSubmit(novaTransacao);
        setDescricao('');
        setValor('');
        setData(new Date());
        setHora(new Date());
        setCategoria('');
        setTipo('Receita');
        setMoeda('');
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

    return (
        <View style={styles.container}>
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
                <Text>{hora.toTimeString().split(' ')[0].substring(0,5)}</Text>
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
                <Button title="Adicionar Transação" onPress={handleSubmit} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
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
});
