import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AuthenticationScreen({ navigation }) {
    const handleLogin = () => {
        // Lógica de autenticação será implementada posteriormente
        navigation.replace('Transacoes');
    };

    const handleRegister = () => {
        // Lógica de registro será implementada posteriormente
        navigation.replace('Transacoes');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao Gerenciador Financeiro</Text>
            <Button title="Login" onPress={handleLogin} />
            <View style={styles.separator} />
            <Button title="Registrar" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
        textAlign: 'center'
    },
    separator: {
        height: 20
    }
});
