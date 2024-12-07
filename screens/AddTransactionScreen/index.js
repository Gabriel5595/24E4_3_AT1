import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddTransactionScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Formulário de Inserção de Transação</Text>
            {/* O formulário será implementado posteriormente */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20
    }
});
