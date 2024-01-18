import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
// import Corsinka from '../assets/Corsinka.png';
// import CorsinkaMute from '../assets/CorsinkaMute.png';
import { Avatar, Button, Card, Text, IconButton } from 'react-native-paper';
import { Icon, darkColors } from '@rneui/themed';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


function Tovar({ id, name, price, lastprice, photoId }) {
  const theme = useTheme();
  const [isMute, setIsMute] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Товар', { productId: id })}>
        <Card style={{ backgroundColor: theme.colors.tertiaryContainer, padding: 4 }}>
          {lastprice ? (
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Image source={require("../assets/sale.png")} style={{ width: 45, height: 45, marginLeft: -11 }} />
              </View>
              <View style={{ flex: 9 }}>
                <Card.Title titleNumberOfLines={4} titleVariant="titleSmall" title={name} titleStyle={{ textAlign: "center", fontSize: 16, color: "#9A1656" }} />
              </View>
            </View>) : (
            <Card.Title titleNumberOfLines={4} titleVariant="titleSmall" title={name} titleStyle={{ textAlign: "center", fontSize: 16, color: "#9A1656" }} />
          )}
          <Card.Cover source={{ uri: `http://192.168.0.113:80/photo/${photoId}` }} />
          <Card.Actions>
            {lastprice ? (
              <Text>
                <Text style={{ fontSize: 13, color: "#9A1656", textDecorationLine: "line-through" }}>{lastprice} ₽</Text> {" "}
                <Text style={{ fontSize: 20, color: "#9A1656" }}>{price} ₽</Text>
              </Text>

            ) : (
              <Text style={{ fontSize: 22, color: "#9A1656", margin: 20 }}>{price} ₽</Text>
            )}
            <TouchableOpacity>
              <IconButton
                icon="cart"
                style={{ backgroundColor: "#9A1656", marginRight: 2 }}
                size={23}
                iconColor="white"
              />
            </TouchableOpacity>

          </Card.Actions>

        </Card>
      </TouchableOpacity>
    </View>
    //   <View style={{ /* стили для содержимого карточки */ }}>
    //     {lastprice ? (
    //       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //         {isMute ? (
    //           <Image
    //             style={{ /* стили для изображения CorsinkaMute */ }}
    //             // source={CorsinkaMute}
    //           />
    //         ) : (
    //           <TouchableOpacity onPress={addProductCors}>
    //             <Image
    //               style={{ /* стили для изображения Corsinka */ }}
    //               // source={Corsinka}
    //             />
    //           </TouchableOpacity>
    //         )}
    //         <TouchableOpacity
    //           style={{ /* стили для кнопки */ }}
    //           onPress={() => {
    //             // Логика для перехода на страницу товара может быть добавлена здесь
    //             // Пример: navigation.navigate('Product', { id });
    //           }}
    //         >
    //           <Text style={{ /* стили для цены */ }}>
    //             <Text style={{ /* стили для новой цены */ }}>{price} ₽ </Text>
    //             <Text style={{ /* стили для старой цены */ }}>{lastprice} ₽ </Text>
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     ) : (
    //       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //         {isMute ? (
    //           <Image
    //             style={{ /* стили для изображения CorsinkaMute */ }}
    //             // source={CorsinkaMute}
    //           />
    //         ) : (
    //           <TouchableOpacity onPress={addProductCors}>
    //             <Image
    //               style={{ /* стили для изображения Corsinka */ }}
    //               // source={Corsinka}
    //             />
    //           </TouchableOpacity>
    //         )}
    //         <TouchableOpacity
    //           style={{ /* стили для кнопки */ }}
    //           onPress={() => {
    //             // Логика для перехода на страницу товара может быть добавлена здесь
    //             // Пример: navigation.navigate('Product', { id });
    //           }}
    //         >
    //           <Text style={{ /* стили для цены */ }}>
    //             <Text style={{ /* стили для новой цены */ }}>{price} ₽ </Text>
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     )}
    //   </View>
    // </View>
  );
}

export default Tovar;
