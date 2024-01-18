import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import AuthService from '../services/Auth.service';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const styles = StyleSheet.create({
        imageBackground: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        },
        tabContainer: {
            flex: 1,
            width: '100%',
        },
    });

    const [currentUser, setCurrentUser] = useState(undefined);
    const [userOrders, setUserOrders] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isEmailActive, setIsEmailActive] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [index, setIndex] = useState(0);
    const navigation = useNavigation();
    const [routes] = useState([
        { key: 'orders', title: 'Мои заказы' },
        { key: 'data', title: 'Мои данные' },
    ]);
    const handleLogout = async () => {
        await AuthService.logout();
        navigation.navigate('Главная')
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await AuthService.getCurrentUser();
                if (user) {
                    setCurrentUser(user);
                    console.log(user)
                }
                AuthService.getOrders(user.id)
                    .then((res) => {
                        setUserOrders(res.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                AuthService.isSubscribed(user.email)
                    .then((response) => {
                        setIsSubscribed(response.data.subscribed === true);
                    })
                    .catch((error) => {
                        console.error(error);
                        setIsSubscribed(false);
                    });

                AuthService.isActiveEmail(user.email)
                    .then((response) => {
                        setIsEmailActive(response.status === 200);
                    })
                    .catch((error) => {
                        console.error(error);
                        setIsEmailActive(false);
                    });
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'orders':
                return (
                    <ScrollView style={{ width: '100%', height: '100%' }}>
                        {userOrders.length > 0 ? (
                            userOrders.map((order) => (
                                <View key={order.id} style={{ backgroundColor: '#F0DAE1', color: '#9A1656' }}>
                                    <Text>
                                        <Text style={{ fontWeight: 'bold' }}>№ заказа:</Text> {order.id}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: 'bold' }}>Статус:</Text> {order.status}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: 'bold' }}>Дата оформления:</Text> {new Date(order.createdAt).toLocaleDateString()}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: 'bold' }}>Сумма:</Text> {order.price} руб.
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <View style={{ margin: 5 }}>
                                <Text style={{ color: '#9A1656', fontSize: 20 }}>У вас нет активных заказов</Text>
                            </View>
                        )}
                    </ScrollView>
                );
            case 'data':
                return (
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{ margin: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: "#9A1656" }}>Email:{' '}
                                <Text style={{ fontWeight: "normal" }}>{currentUser.email}</Text></Text>
                        </View>
                        <View style={{ margin: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: "#9A1656" }}>Подписка на рассылку: {' '}
                                {isSubscribed ? <Text style={{ fontWeight: "normal" }}>подключена</Text> : <Text style={{ fontWeight: "normal" }}>не подключена</Text>}</Text>

                        </View>
                        <View style={{ margin: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: "#9A1656" }}>Статус почты: {' '}
                                {isEmailActive ? <Text style={{ fontWeight: "normal" }}>активна</Text> : <Text style={{ fontWeight: "normal" }}>не активна</Text>}</Text>
                        </View>
                        <View style={{ alignItems: "center", margin: 15 }}>
                            <TouchableOpacity onPress={() => setModalShow(true)} style={{ borderColor: '#9A1656', borderWidth: 2, borderRadius: 15, color: '#9A1656', width: "50%" }}>
                                <Text style={{ color: '#9A1656', padding: 10, fontSize: 22, textAlign: "center" }}>Сменить пароль</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center", margin: 15 }}>
                            <TouchableOpacity onPress={handleLogout} style={{ borderColor: '#9A1656', borderWidth: 2, borderRadius: 15, color: '#9A1656', width: "50%", backgroundColor: "#9A1656" }}>
                                <Text style={{ color: '#F0DAE1', padding: 10, fontSize: 22, textAlign: "center" }}>Выйти</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ImageBackground source={require('../assets/Pattern.png')} resizeMode="cover" style={styles.imageBackground}>
            <View style={styles.tabContainer}>
                {currentUser && (
                    <View style={{ width: '100%', height: '100%' }}>
                        <Text style={{ color: '#9A1656', textAlign: 'center', fontSize: 20, margin: '6%' }}>
                            Профиль <Text style={{ fontWeight: 'bold' }}>{currentUser.username}</Text>
                        </Text>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            renderTabBar={(props) => (
                                <TabBar
                                    {...props}
                                    indicatorStyle={{ backgroundColor: 'white' }}
                                    style={{ backgroundColor: '#9A1656' }}
                                    labelStyle={{ color: '#F0DAE1', fontSize: 16 }}
                                />
                            )}
                        />
                    </View>
                )}
            </View>
        </ImageBackground>
    );
};

export default Profile;
