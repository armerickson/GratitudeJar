import { StyleSheet, Text, TextInput, View, Dimensions} from 'react-native'
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../misc/colors';
import quotes from '../assets/quotes.json';
import ScreenTemplate from './ScreenTemplate';

function IntroPage({setName}) {
  const introQuote = quotes[0];
  const [inputText, setInputText] = useState('');
  
  const submit = async () => {
    try {
      setName(inputText);
      await AsyncStorage.setItem('user', inputText);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, styles.text]}>Gratitude Jar</Text>
          <Text style={[styles.quote, styles.text]}>{introQuote.text}</Text>
          <Text style={[styles.quote, styles.text]}>{`- ${introQuote.author}`}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputTitle, styles.text]}>Enter Your Name to Continue</Text>
          <TextInput
            value={inputText}
            onChangeText={(name) => setInputText(name)}
            placeholder="Enter your name..."
            placeholderTextColor='rgba(30, 30, 30, 0.2)'
            style={[styles.nameInput, styles.text]}
          />
          {inputText.trim().length >= 2 &&
            <MaterialCommunityIcons 
              name="arrow-right" 
              onPress={submit}
              color={'#fff'} 
              size={26} 
              style={styles.icon}  
            />
          }
        </View>
        
      </View >
    </ScreenTemplate>
  )
}
export default IntroPage;

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: width - 40,
  },
  text: {
    color: colors.LIGHT,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    top: 20,
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Courgette-Regular',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  quote: {
    fontFamily: 'Montserrat-LightItalic',
    textAlign: 'center',
    marginBottom: 5,
  },
  inputContainer: {
    position: 'relative',
    top: '20%',
    height: 100,
  },
  nameInput: {
    borderWidth: 2,
    borderColor: colors.LIGHT,
    width: width - 50,
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 25,
    marginTop: 5,
    marginBottom: 15,    
  },
  icon: {
    alignSelf: 'center',
    backgroundColor: colors.LIGHT,
    color: colors.ORANGE,
    padding: 10,
    borderRadius: 50,
    width: '10%',
    elevation: 5,
  },
});
