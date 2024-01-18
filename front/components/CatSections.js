import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { StyleSheet, SafeAreaView, ImageBackground } from 'react-native';

function CatSections({ navigation }) {
  const theme = useTheme();
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

  return (
    <ImageBackground source={require('../assets/Pattern.png')} resizeMode="cover" style={styles.image}>
    <ScrollView>
      <View style={{ flexDirection: 'column' }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
          <View style={{ flex: 1, fontSize: 28 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Каталог', { catId: 7 })}>
              <Card style={{ padding: 1, backgroundColor: theme.colors.tertiaryContainer }}>
                <Card.Cover source={require('../assets/cat7.png')} />
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Каталог', { catId: 1 })}>
              <Card style={{ padding: 1, margin: 2, backgroundColor: theme.colors.tertiaryContainer }}>
                <Card.Cover source={require('../assets/cat1.png')} />
              </Card>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Каталог', { catId: 2 })}>
              <Card style={{ padding: 1, margin: 2, backgroundColor: theme.colors.tertiaryContainer }}>
                <Card.Cover source={require('../assets/cat2.png')} />
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Каталог', { catId: 3 })}>
              <Card style={{ padding: 1, margin: 5, backgroundColor: theme.colors.tertiaryContainer }}>
                <Card.Cover source={require('../assets/cat3.png')} />
              </Card>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Каталог', { catId: 4 })}>
              <Card style={{ padding: 1, margin: 2, backgroundColor: theme.colors.tertiaryContainer }}>
                <Card.Cover source={require('../assets/cat4.png')} />
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Каталог', { catId: 5 })}>
              <Card style={{ padding: 1, margin: 5, backgroundColor: theme.colors.tertiaryContainer }}>
                <Card.Cover source={require('../assets/cat5.png')} />
              </Card>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Каталог', { catId: 6 })}>
              <Card style={{ padding: 1, margin: 2, backgroundColor: theme.colors.tertiaryContainer }}>
                <Card.Cover source={require('../assets/cat6.png')} />
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
    </ImageBackground>
  )
}

export default CatSections;
