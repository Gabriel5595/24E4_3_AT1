import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validarEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const validarSenha = (senha) => {
        return senha.length >= 6;
    };

    const handleLogin = async () => {
        if (!validarEmail(email)) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            return;
        }

        if (!validarSenha(password)) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            const usuario = await AsyncStorage.getItem(email);
            if (usuario) {
                const usuarioObj = JSON.parse(usuario);
                if (usuarioObj.senha === password) {
                    onLoginSuccess();
                } else {
                    Alert.alert('Erro', 'Senha incorreta.');
                }
            } else {
                Alert.alert('Erro', 'Usuário não encontrado. Por favor, registre-se.');
            }
        } catch (error) {
            console.error('Erro ao acessar o AsyncStorage:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
        }
    };

    const handleRegister = async () => {
        if (!validarEmail(email)) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            return;
        }

        if (!validarSenha(password)) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            const usuarioExistente = await AsyncStorage.getItem(email);
            if (usuarioExistente) {
                Alert.alert('Erro', 'Usuário já registrado. Por favor, faça login.');
                return;
            }

            const novoUsuario = {
                email,
                senha: password,
            };

            await AsyncStorage.setItem(email, JSON.stringify(novoUsuario));
            Alert.alert('Sucesso', 'Registro realizado com sucesso!');
            onLoginSuccess();
        } catch (error) {
            console.error('Erro ao acessar o AsyncStorage:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar registrar.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Senha:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title="Entrar" onPress={handleLogin} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Registrar" onPress={handleRegister} />
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
    buttonContainer: {
        marginTop: 20,
    },
});
