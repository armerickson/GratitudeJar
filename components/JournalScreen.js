import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ScrollView, 
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Button,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../misc/colors';
import ScreenTemplate from './ScreenTemplate';
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.clear();

function JournalScreen({name, notes, setNotes, quote, todaysNumericalDate, currentDateObj}) {
  const months = [
    "January", 
    "February",
    "March",
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
  ];
  const date = new Date();
  const writtenDate = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  const title = "What are you grateful for today?";
  const prompts = [
    "I am grateful for:", 
    "I am grateful for:", 
    "I am grateful for:"
  ];

  const [greeting, setGreeting] = useState('evening');  
  const [answers, setAnswers] = useState([]);
  const [saveBtnVisible, setSaveBtnVisible] = useState(true);
  const [entryBeingEdited, setEntryBeingEdited] = useState(false);

  useEffect(() => {
    getGreeting();

    //gets the current day's entry if one was already saved
    if(notes.length && notes[notes.length-1].id === todaysNumericalDate) {
      setAnswers(notes[notes.length-1].answers);
    };
  }, [])
  
  //shows save btn when text is input
  useEffect(() => {
    let newArr = [...answers];
    newArr = newArr.filter(e => String(e).trim());
    newArr.length && entryBeingEdited ? setSaveBtnVisible(true) : setSaveBtnVisible(false);
  }, [answers])

  const getGreeting = () => {
    const hrs = date.getHours();
    if (hrs === 0 || hrs < 12) return setGreeting('Morning');
    if (hrs === 1 || hrs < 17) return setGreeting('Afternoon');
    setGreeting('Evening');
  }

  const handleUpdateAnswers = (answer, index) => {
    //entryBeingEdited === true when this function is running
    //only set to true if !entryBeingEdited to avoid setting over and over
    if(!entryBeingEdited) setEntryBeingEdited(true);  

    let newArr = [...answers];
    newArr[index] = answer;
    setAnswers(newArr);
  }

  const saveEntry = async (e) => {
    if(!answers.length) return;

    setEntryBeingEdited(false); //entry is saved

    //if ans not null or undefined then trim whitespace, 
    //else set that spot to empty string
    const trimmedAnswers = answers.map(ans => ans ? ans.trim() : '');

    const newEntry = {
      id: todaysNumericalDate,
      numericalDate: todaysNumericalDate, 
      date: currentDateObj,
      writtenDate: writtenDate,
      quote: quote,
      prompts: prompts,
      answers: trimmedAnswers,
    };

    let tempNotes = [...notes];

    //checks if current day already has an entry
    //if no, add new entry. if yes, edit current day's entry
    if(notes !== null) {
      const foundIndex = tempNotes.findIndex(entry => entry.id === newEntry.id);
      foundIndex !== -1 ? tempNotes[foundIndex] = newEntry : tempNotes = [...notes, newEntry];
    } else {
      tempNotes = [newEntry];
    }
    
    setNotes(tempNotes);
    Keyboard.dismiss();
    setSaveBtnVisible(false);
  }

  //getPrompts() instead of <getPrompts/> as to not re-render
  const getPrompts = () => (
    prompts.map((thisPrompt, index) => (
      <View key={thisPrompt+index}>
        <TextInput 
          placeholder={JSON.stringify(index+1)+". I am grateful for..."}
          placeholderTextColor='rgba(248, 248, 255, 0.5)'
          value={answers[index]}
          onChangeText={(text) => handleUpdateAnswers(text, index)}
          multiline={true}
          style={[styles.textInput]}
        />
      </View>
    ))
  )

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.greetingTitle, styles.greeting, styles.text]}>Good {greeting}, {name}</Text>
          {saveBtnVisible &&
            <Pressable 
              onPress={saveEntry} 
              android_ripple={{ color: colors.YELLOW }} 
              style={styles.saveBtn}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>}
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollview}>
            <View style={styles.greetTitleContainer}>
              <Text style={styles.date}>{writtenDate}</Text>
              <View style={styles.quoteContainer}>
                <Text style={[styles.quote, styles.text]}>{quote.text}</Text>
                <Text style={[styles.quote, styles.text]}>- {quote.author}</Text>
              </View>
              <Text style={[styles.greetingTitle, styles.title, styles.text]}>{title}</Text>
              <MaterialCommunityIcons 
                name="cards-diamond-outline" 
                color={'#fff'} 
                size={26} 
                style={styles.icon}
              />
            </View>
            <View style={styles.textInputContainer}>
              {getPrompts()}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    </ScreenTemplate>
  )
}
export default JournalScreen;

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width - 40,
    marginTop: 50,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    color: colors.LIGHT,
  },
  date: {
    color: colors.LIGHT,
    fontSize: 20,
    fontFamily: 'Montserrat-LightItalic',
  },
  greetTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  greetingTitle: {
    fontSize: 20,
    fontFamily: 'Courgette-Regular',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    opacity: 0.5,
  },
  title: {
    marginTop: 10,
  },
  quoteContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  quote: {
    textAlign: 'center',
    fontFamily: 'Montserrat-LightItalic',
    marginVertical: 2,
  },
  promptText: {
    fontFamily: 'Montserrat-LightItalic',
    fontSize: 18,
    marginVertical: 15,
  },
  icon: {
    marginVertical: 15,
  }, 
  textInputContainer: {
    borderRadius: 10,
    flex:1,
    height: '100%',
  },
  textInput: {
    color: colors.LIGHT,
    fontFamily: 'Montserrat-Regular',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    lineHeight: 25,
    minHeight: 60,
    fontSize: 16,
    borderBottomColor: 'rgba(248, 248, 255, 0.3)',
    borderBottomWidth: 1,
    marginVertical: 10,
    width: width - 40,
  },
  saveBtn: {
    height: 30,
    width: '20%',
    borderRadius: 7,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: colors.LIGHT,
  },
  btnText: {
    color: "#DB6A41",
  },
});

