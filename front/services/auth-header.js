import AsyncStorage from '@react-native-async-storage/async-storage';

const authHeader = async () => {
  try {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken };
    } else {
      return {};
    }
  } catch (error) {
    console.error('Ошибка при получении заголовка авторизации:', error);
    return {};
  }
};

export default authHeader;
