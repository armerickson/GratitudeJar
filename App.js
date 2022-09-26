import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import quotes from './assets/quotes.json';
import colors from './misc/colors';
import IntroPage from './components/IntroPage';
import JournalScreen from './components/JournalScreen';
import Memories from './components/Memories';
import CalendarPage from './components/CalendarPage';
import FullNote from './components/FullNote';

/**
 * Features to add:
 * settings: dark mode, backup, export
 * DeleteModal (are you sure you want to delete)
 * Share text, share image
 * reminders
 * add photos
 * different prompts
 */

export default function App() {
  LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state', ]);

  const [fontLoaded, setFontLoaded] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState([]);
  const [quote, setQuote] = useState(quotes[0]);
  const [quoteNum, setQuoteNum] = useState(0); //quote index in quotes.json
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const [currentDateObj, setCurrentDateObj] = useState({}); //ex:{year: 2022, month: 1, day: 1}
  const [todaysNumericalDate, setTodaysNumericalDate] = useState(''); //ex:'1-1-2022'

  const Stack = createStackNavigator();
  const Tab = createMaterialBottomTabNavigator();

  useEffect(() => {
    //load fonts
    Font.loadAsync({
      'Courgette-Regular': require('./assets/fonts/Courgette-Regular.ttf'),
      'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
      'Montserrat-LightItalic': require('./assets/fonts/Montserrat-LightItalic.ttf'),
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
    })
    .then(() => {
     setFontLoaded(true)
    }) 
    getTodaysDate();
    getNotes().catch(console.error);
    getUser().catch(console.error);
    getQuote().catch(console.error);

    
  }, [])

  //updates notes in async storage when notes array changes
  useEffect(() => {
    setNotesToStorage();
  }, [notes])

  const setNotesToStorage = async () => {
    try {
      await AsyncStorage.setItem('entries', JSON.stringify(notes));
    } catch (e) {
      console.log(e);
    }
  }

  const getTodaysDate = () => {
    const date = new Date();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const year = date.getFullYear();

    //converts days and months < 10 to have 0 at beginning. ex: 9 -> 09
    const leadingZeroMonth = month >= 10 ? month : ('0' + month);
    const leadingZeroDay = day >= 10 ? day : ('0' + day);

    setTodaysNumericalDate(`${year}-${leadingZeroMonth}-${leadingZeroDay}`);
    setCurrentDateObj({year: year, month: month, day: day})
  }

  const getNotes = async () => {
    const existingEntries = await AsyncStorage.getItem('entries');
    if(existingEntries !== null) {setNotes(JSON.parse(existingEntries));}
  }

  const getUser = async () => {
    const user = await AsyncStorage.getItem('user');
    if(user !== null) {setName(user);}
  }

  const getQuote = async () => {
    const prevDate = await AsyncStorage.getItem('date');

    //if current date !== prevDate, update quote by iterating through quotes.json
    if(prevDate === null || prevDate !== todaysNumericalDate) {
      //iterate or reset to beginning if out of quotes
      quoteNum === quotes.length-1 ? setQuoteNum(0) : setQuoteNum(prev => prev + 1);
      await AsyncStorage.setItem('date', todaysNumericalDate);
    }

    setQuote(quotes[quoteNum]);
  }

  const RenderJournalScreen = (props) => (
    <JournalScreen 
      {...props}
      name={name} 
      notes={notes}
      setNotes={setNotes}
      quote={quote}
      todaysNumericalDate={todaysNumericalDate}
      currentDateObj={currentDateObj}
    />
  );

  const RenderMemoriesScreen = (props) => (
    <Memories 
      {...props}
      notes={notes}
      setNotes={setNotes}
      setTabBarVisible={setTabBarVisible}
    />
  );

  const RenderCalendarPage = (props) => (
    <CalendarPage
      {...props}
      notes={notes}
      setNotes={setNotes}
      todaysNumericalDate={todaysNumericalDate}
      currentDateObj={currentDateObj}
      setTabBarVisible={setTabBarVisible}
    />
  );

  const RenderSettings = (props) => (
    <Settings
      {...props}
      onCreateTriggerNotification={onCreateTriggerNotification}
    />
  );



  //created stack navigators in App.js for better performance
  const MemoriesStack = () => (
    <Stack.Navigator
      screenOptions={{ headerTitle: '', headerShown: false}}
      initialRouteName='Memories'
    >
      <Stack.Screen component={RenderMemoriesScreen} name='Memories'/>
      <Stack.Screen component={FullNote} name='FullNote'/>
    </Stack.Navigator>
  );

  const CalendarStack = () => (
    <Stack.Navigator
      screenOptions={{headerTitle: '', headerShown: false}}
      initialRouteName='CalendarPage'
    >
      <Stack.Screen component={RenderCalendarPage} name='CalendarPage'/>
      <Stack.Screen component={FullNote} name='FullNote'/>
    </Stack.Navigator>
  );
  
  if (!fontLoaded) return null;

  //show intro page if storage has no name saved
  if(!name) return <IntroPage setName={setName} />

  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName="JournalScreen"
        activeColor={colors.ORANGE}
        barStyle={{ backgroundColor: colors.LIGHT, display: tabBarVisible ? 'flex' : 'none'}}
        shifting={false}
      >
        <Tab.Screen 
          name="NotesNavigator"
          component={MemoriesStack} 
          options={{
            tabBarLabel: 'Memories',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="book-open" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="JournalScreen"
          component={RenderJournalScreen} 
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="lead-pencil" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="CalendarNavigator"
          component={CalendarStack} 
          options={{
            tabBarLabel: 'Calendar',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}