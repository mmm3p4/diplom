import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import Menu from './components/Menu';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstPage from './components/FirstPage';
import Catalog from './components/Catalog';
import CatSections from './components/CatSections';
import { PaperProvider } from 'react-native-paper';
import Registration from './components/Registration';
import Authorization from './components/Authorization';
import Profile from './components/Profile';
import PageTovar from './components/PageTovar';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('./assets/Pattern.png')} resizeMode="cover" style={styles.image}>
          <Stack.Navigator initialRouteName="Главная">
            <Stack.Screen name="Главная" component={FirstPage} />
            <Stack.Screen name="Категории" component={CatSections} />
            <Stack.Screen name="Каталог" component={Catalog} />
            <Stack.Screen name="Регистрация" component={Registration} />
            <Stack.Screen name="Авторизация" component={Authorization} />
            <Stack.Screen name="Профиль" component={Profile} />
            <Stack.Screen name="Товар" component={PageTovar} />
          </Stack.Navigator>
          <Menu />
        </ImageBackground>
        <StatusBar style="auto" />
      </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: "100%",
    height: "100%",
  },
});
