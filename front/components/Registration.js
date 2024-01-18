import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import AuthService from '../services/Auth.service';
import { StyleSheet, SafeAreaView, ImageBackground, Alert } from 'react-native';
import { Icon, darkColors } from '@rneui/themed';
import FormCode from '../hooks/FormCode';
import { useNavigation } from '@react-navigation/native';

const Registration = () => {
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
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubcribed] = useState(false);
  const [username, setName] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [isWaitingForActivationCode, setIsWaitingForActivationCode] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const navigation = useNavigation();

  const onRegistration = async () => {
    setEmailInvalid(false);
    setPasswordInvalid(false);
    setNameInvalid(false);

    if (!password || !email || !username) {
      if (!password) setPasswordInvalid(true);
      if (!email) setEmailInvalid(true);
      if (!username) setNameInvalid(true);
      Alert.alert('Ошибка', 'Заполните все поля!');
    } else {
      try {
        const response = await AuthService.register(username, email, password, subscribed);

        if (response.status === 200) {
          setUserInfo({ username, email, password, subscribed });
          setIsWaitingForActivationCode(true);
        } else {
          setName('');
          setEmail('');
          setPassword('');
          setSubcribed(false);
          setIsWaitingForActivationCode(false);
        }
      } catch (err) {
        Alert.alert('Ошибка', err.response.data.message);
      }
    }
  };

  return (
    <ImageBackground source={require('../assets/Pattern.png')} resizeMode="cover" style={styles.image}>
      <ScrollView>
        <View style={{ flex: 1, padding: 20, alignItems: "center" }}>
          <Image source={(require("../assets/BUYF.png"))} />
          {isWaitingForActivationCode ? (
              <FormCode props={userInfo} />
          ) : (
            <>
              <Text style={{ color: '#9A1656', fontSize: 35, fontWeight: 'bold', margin: 30 }}>РЕГИСТРАЦИЯ</Text>

              <View>
                <Text style={{ fontSize: 20, color: '#9A1656', fontWeight: 'bold', marginBottom: 10 }}>Имя пользователя</Text>
                <TextInput
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChangeText={(value) => setName(value)}
                  style={{ width: 200, height: 50, borderColor: '#9A1656', borderWidth: 2, marginBottom: 30, borderRadius: 10, backgroundColor: "white", padding: 7 }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 20, color: '#9A1656', fontWeight: 'bold', marginBottom: 10 }}>Почта</Text>
                <TextInput
                  placeholder="Введите почту"
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  style={{ width: 200, height: 50, borderColor: '#9A1656', borderWidth: 2, marginBottom: 30, borderRadius: 10, backgroundColor: "white", padding: 7 }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 20, color: '#9A1656', fontWeight: 'bold', marginBottom: 10 }}>Пароль</Text>
                <TextInput
                  placeholder="Введите пароль"
                  secureTextEntry
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                  style={{ width: 200, height: 50, borderColor: '#9A1656', borderWidth: 2, marginBottom: 30, borderRadius: 10, backgroundColor: "white", padding: 7 }}
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setSubcribed(!subscribed)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name={subscribed ? 'check-circle-outline' : 'radio-button-unchecked'}
                    size={24}
                    color="#9A1656"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={{ fontSize: 20, color: '#9A1656', fontWeight: 'bold' }}>Я подписываюсь на рассылку</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={onRegistration} style={{ backgroundColor: '#9A1656', padding: 10, alignSelf: 'center', marginTop: 30, borderRadius: 10 }}>
                <Text style={{ color: "#F0DAE1", fontWeight: 'bold', fontSize: 20 }}>Зарегистрироваться</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', margin: 8}}>
                <Text style={{color: "#9A1656", fontSize: 18}}>Уже зарегистрированы? </Text>
                <Text style={{color: "#9A1656", textDecorationLine: "underline", fontSize: 18}} onPress={() => navigation.navigate('Авторизация')}>Войти</Text>
              </View>

            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Registration;
