import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { View, Image, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text, IconButton } from 'react-native-paper';
import AuthService from '../services/Auth.service';
import { useTheme } from 'react-native-paper';
// import ModalOrder from "../components/ModalOrder";
import { useNavigation } from '@react-navigation/native';


function PageTovar({ route }) {
  const navigation = useNavigation();
  const [product, setProduct] = useState({});
  const { productId: initialId } = route.params;
  const [modalShow, setModalShow] = useState(false);
  const theme = useTheme();



  useEffect(() => {
    axios.get(`http://192.168.0.113:80/product/${initialId}`).then((response) => {
      setProduct(response.data);

    });
  }, []);

  if (!product.id) return null;

  return (
    <>
      <Card style={{ backgroundColor: theme.colors.tertiaryContainer, padding: 40 }}>
        <Card.Cover
          source={{ uri: `http://192.168.0.113:80/photo/${product.photoId}` }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.bukettitle}>{product.name}</Text>
          <Text style={styles.opisanie}>Описание:</Text>
          <Text style={styles.desc}>{product.description}</Text>
          <Text style={styles.price}>{product.price} Р</Text>
          {product.lastprice ? <Text style={styles.lastPrice}>{product.lastprice} Р</Text> : null}
          <Button
            title="Купить"
            type="light"
            onPress={() => setModalShow(true)} // Assuming setModalShow is defined somewhere
            buttonStyle={styles.button}
          />
        </View>
      </Card>
      {/* <ModalOrder show={modalShow} onHide={() => setModalShow(false)} product={product} /> */}
    </>
  )
}
const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    borderWidth: 0, // Set the border width to 0 to remove the default border
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    marginLeft: '5%',
  },
  bukettitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  opisanie: {
    fontSize: 16,
    marginTop: 5,
  },
  desc: {
    fontSize: 14,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    marginTop: 5,
    color: 'green',
  },
  lastPrice: {
    fontSize: 16,
    color: 'red',
    textDecorationLine: 'line-through',
  },
  button: {
    marginTop: 10,
  },
});

export default PageTovar;
