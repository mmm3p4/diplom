import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, Image, View, ImageBackground, ScrollView } from 'react-native';
import Tovar from './Tovar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
function FirstPage() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        let response;
        response = await axios.get(`http://192.168.0.113:80/products/7`), {
          timeout: 10000,
        };

        const filteredProducts = response.data.filter((product) => product.amount > 0);
        setFilteredProducts(filteredProducts);
        console.log(userData)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ImageBackground source={require('../assets/Pattern.png')} resizeMode="cover" style={styles.imageBackground}>
      <ScrollView>
        <View style={styles.container}>
          <Image style={styles.logo} source={require("../assets/BUYF.png")} />
          <Text style={styles.text}>Выгодные предложения для Вас</Text>
        </View>
        <View style={styles.productsContainer}>
          {filteredProducts.map((product, index) => (
            <View key={product.id} style={styles.productItem}>
              <Tovar
                id={product.id}
                name={product.name}
                amount={product.amount}
                price={product.price}
                lastprice={product.lastprice}
                photoId={product.photoId}
                catId={7}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginBottom: 20,
  },
  text: {
    color: '#9A1656',
    fontSize: 18,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  productItem: {
    margin: 10,
    width: '44%', // установите желаемую ширину каждого товара
  },
});

export default FirstPage;
