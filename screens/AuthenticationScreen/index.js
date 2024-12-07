import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import UserForm from '../../components/UserForm';

export default function AuthenticationScreen({ navigation, onLoginSuccess }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao Gerenciador Financeiro</Text>
            <UserForm onLoginSuccess={onLoginSuccess} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
