import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ImageBackground, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import AuthService from '../services/Auth.service';
import PatternDark2 from '../assets/Pattern_Dark2.png';
import { useNavigation } from '@react-navigation/native';

const Authorization = () => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        image: {
            flex: 1,
            justifyContent: 'center',
            alignItems: "center",
            width: "100%",
            height: "100%",
        },
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const navigation = useNavigation();

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleFormSubmit = async () => {
        setUsernameInvalid(false);
        setPasswordInvalid(false);

        if (!username && !password) {
            setUsernameInvalid(true);
            setPasswordInvalid(true);
            Alert.alert('Ошибка', 'Заполните поля');
            return;
        }

        if (!username) {
            setUsernameInvalid(true);
            Alert.alert('Ошибка', 'Введите имя пользователя');
            return;
        }

        if (!password) {
            setPasswordInvalid(true);
            Alert.alert('Ошибка', 'Введите пароль');
            return;
        }

        try {
            await AuthService.login(username, password);
            navigation.navigate('Профиль');
        } catch (error) {
            Alert.alert('Ошибка', error.message);
        }
    };

    return (
        <ImageBackground source={require('../assets/Pattern_Dark2.png')} resizeMode="cover" style={styles.image}>
            <ScrollView>
                <View style={{ flex: 1, padding: 20, alignItems: "center" }}>
                    <Image source={(require("../assets/BUYF1.png"))} />
                    <Text style={{ color: '#F0DAE1', fontSize: 35, fontWeight: 'bold', margin: 30 }}>АВТОРИЗАЦИЯ</Text>
                    <View>
                        <Text style={{ fontSize: 20, color: '#F0DAE1', fontWeight: 'bold', marginBottom: 10 }}>Имя пользователя</Text>
                        <TextInput
                            placeholder="Введите имя пользователя"
                            value={username}
                            invalid={usernameInvalid}
                            onChangeText={handleUsernameChange}
                            style={{ width: 200, height: 50, borderColor: '#F0DAE1', borderWidth: 2, marginBottom: 30, borderRadius: 10, backgroundColor: "white", padding: 7 }}
                        />
                        {/* {usernameInvalid && <Text style={{ color: 'red', textAlign: 'center' }}>Введите имя пользователя</Text>} */}
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, color: '#F0DAE1', fontWeight: 'bold', marginBottom: 10 }}>Пароль</Text>
                        <TextInput
                            placeholder="Введите пароль"
                            secureTextEntry
                            value={password}
                            invalid={passwordInvalid}
                            onChangeText={handlePasswordChange}
                            style={{ width: 200, height: 50, borderColor: '#F0DAE1', borderWidth: 2, marginBottom: 30, borderRadius: 10, backgroundColor: "white", padding: 7 }}
                        />
                    </View>



                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate('http://localhost:8081/auth/vkontakte')}>
                            <Text style={{ color: '#F0DAE1', textAlign: 'center', fontSize: 18 }}>Войти с помощью VK</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ color: "#F0DAE1", fontSize: 18 }}>Забыли пароль? </Text>
                            <Text style={{ color: "#F0DAE1", textDecorationLine: "underline", fontSize: 18 }} onPress={() => navigation.navigate('/resetpass')}>Восстановить</Text>
                        </View>


                        <TouchableOpacity onPress={handleFormSubmit} style={{ backgroundColor: '#F0DAE1', padding: 15, alignSelf: 'center', marginTop: 30, borderRadius: 10, marginBottom: 20 }} >
                            <Text style={{ color: "#9A1656", fontWeight: 'bold', fontSize: 20 }}>Войти</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', margin: 8 }}>
                            <Text style={{ color: "#F0DAE1", fontSize: 18 }}>Нет аккаунта? </Text>
                            <Text style={{ color: "#F0DAE1", textDecorationLine: "underline", fontSize: 18 }} onPress={() => navigation.navigate('Регистрация')}>Регистрация</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground >
    );
};

export default Authorization;
