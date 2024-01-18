import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AuthService from '../services/Auth.service';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Menu() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn())
  const [cors, setCors] = useState([]);


  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error('Ошибка', error);
      }
    };
  
    checkUserLoggedIn();
  }, [isLoggedIn]);
  
  

//   useEffect(() => {
//     AuthService.getCors(currentUser.id)
//       .then((res) => {
//         setCors(res.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);




  return (
    <View style={{ backgroundColor: "#9A1656" }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Главная')}>
            <Icon style={{marginRight: 60 }} color='white' name= 'home' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Категории')}>
            <Icon style={{marginRight: 60 }} color='white' name= 'menu' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Каталог')}>
            <Icon style={{marginRight: 60 }} color='white' name= 'shopping-cart' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Каталог')}>
            <Icon style={{marginRight: 60 }} color= 'white' name='help' />
          </TouchableOpacity>
          {isLoggedIn ? (
          <TouchableOpacity onPress={() => navigation.navigate('Профиль')}>
            <Icon style={{marginRight: 20 }} color= 'white' name='face' />
          </TouchableOpacity>
          ): (
            <TouchableOpacity onPress={() => navigation.navigate('Авторизация')}>
            <Icon style={{marginRight: 20 }} color= 'white' name='face' />
          </TouchableOpacity>
          )}
          
        </View>
        {/* {isLoggedIn ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Cors')}>
              <Image source={Corsinka} style={{ width: 38, height: 38, marginRight: 10 }} />
            </TouchableOpacity>
            {cors.length > 0 && <View style={{ backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2, marginTop: -3 }}>
              <Text style={{ color: 'white' }}>{cors.length}</Text>
            </View>}
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={{ color: 'white', marginRight: 10 }}>Профиль</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ color: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 5, paddingHorizontal: 5 }}>Выйти</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={{ color: 'white', marginRight: 10 }}>Войти</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 5, paddingHorizontal: 5 }}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        )}
        {(currentUser && currentUser.roles.includes("ROLE_ADMIN")) && (
          <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
            <Text style={{ color: 'red', marginLeft: 10 }}>Панель администратора</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
}

export default Menu;
