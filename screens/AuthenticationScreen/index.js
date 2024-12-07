import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AuthenticationScreen({ navigation, onLogin }) {
    const handleLogin = () => {
        // Chama a função de login passada via props
        onLogin();
    };

    const handleRegister = () => {
        // Lógica de registro será implementada posteriormente
        onLogin();
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
