import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ImageBackground } from 'react-native';
import Tovar from './Tovar';
import axios from 'axios';

function Catalog({ route }) {
  const { catId: initialCatId } = route.params;
  const [filteredProducts, setFilteredProducts] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (initialCatId === 0) {
          response = await axios.get('http://192.168.0.113:80/products'), {
            timeout: 10000,
          };
        } else {
          response = await axios.get(`http://192.168.0.113:80/products/${initialCatId}`), {
            timeout: 10000,
          };
        }

        const filteredProducts = response.data.filter((product) => product.amount > 0);
        setFilteredProducts(filteredProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [initialCatId]);

  return (
    <ImageBackground source={require('../assets/Pattern.png')} resizeMode="cover" style={styles.imageBackground}>
    <ScrollView>
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
              catId={initialCatId}
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
    width: '44%',// установите желаемую ширину каждого товара
  },
});

export default Catalog;
