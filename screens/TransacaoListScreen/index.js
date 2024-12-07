// screens/TransacaoListScreen.js

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Certifique-se de instalar esta dependência
import TransacaoItemList from '../../components/TransacaoItemList';

export default function TransacaoListScreen({ navigation }) {
    // Dados Originais com 10 transações
    const dadosOriginais = [
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
        },
        {
            id: '3',
            descricao: 'Pagamento Freelancer',
            valor: 800.00,
            data: '2024-12-06',
            hora: '14:45',
            categoria: 'Trabalho',
            tipo: 'Receita',
            moeda: 'USD'
        },
        {
            id: '4',
            descricao: 'Conta de Luz',
            valor: 150.75,
            data: '2024-12-04',
            hora: '08:20',
            categoria: 'Serviços',
            tipo: 'Despesa',
            moeda: 'BRL'
        },
        {
            id: '5',
            descricao: 'Restaurante',
            valor: 90.00,
            data: '2024-12-03',
            hora: '19:30',
            categoria: 'Alimentação',
            tipo: 'Despesa',
            moeda: 'EUR'
        },
        {
            id: '6',
            descricao: 'Compra Online',
            valor: 250.00,
            data: '2024-12-02',
            hora: '16:10',
            categoria: 'Compras',
            tipo: 'Despesa',
            moeda: 'USD'
        },
        {
            id: '7',
            descricao: 'Salário Extra',
            valor: 1200.00,
            data: '2024-12-01',
            hora: '10:00',
            categoria: 'Trabalho',
            tipo: 'Receita',
            moeda: 'BRL'
        },
        {
            id: '8',
            descricao: 'Academia',
            valor: 80.00,
            data: '2024-11-30',
            hora: '07:15',
            categoria: 'Saúde',
            tipo: 'Despesa',
            moeda: 'BRL'
        },
        {
            id: '9',
            descricao: 'Gasolina',
            valor: 60.00,
            data: '2024-11-29',
            hora: '12:50',
            categoria: 'Transporte',
            tipo: 'Despesa',
            moeda: 'BRL'
        },
        {
            id: '10',
            descricao: 'Venda de Artesanato',
            valor: 300.00,
            data: '2024-11-28',
            hora: '15:30',
            categoria: 'Vendas',
            tipo: 'Receita',
            moeda: 'USD'
        }
    ];

    // Estados para Ordenação e Filtragem
    const [sortOption, setSortOption] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [dados, setDados] = useState(dadosOriginais);

    // Função para Ordenar Dados
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

    // Função para Filtrar Dados
    const filtrarDados = (dadosParaFiltrar, criterio) => {
        if (criterio === 'Receita') {
            return dadosParaFiltrar.filter(item => item.tipo === 'Receita');
        } else if (criterio === 'Despesa') {
            return dadosParaFiltrar.filter(item => item.tipo === 'Despesa');
        }
        return dadosParaFiltrar;
    };

    // useEffect para aplicar Ordenação e Filtragem sempre que sortOption ou filterOption mudar
    useEffect(() => {
        let dadosProcessados = [...dadosOriginais];

        // Aplicar Filtragem
        dadosProcessados = filtrarDados(dadosProcessados, filterOption);

        // Aplicar Ordenação
        if (sortOption !== '') {
            dadosProcessados = ordenarDados(dadosProcessados, sortOption);
        }

        setDados(dadosProcessados);
    }, [sortOption, filterOption]);

    return (
        <View style={styles.container}>
            {/* Seção de Ordenação */}
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

            {/* Seção de Filtragem */}
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

            {/* Botão para Resetar Filtros e Ordenação */}
            <View style={styles.resetButton}>
                <Button
                    title="Resetar Filtros e Ordenação"
                    onPress={() => {
                        setSortOption('');
                        setFilterOption('');
                    }}
                />
            </View>

            {/* Lista de Transações */}
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
    }
});
