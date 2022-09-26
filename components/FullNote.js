import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions} from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBackHandler } from '@react-native-community/hooks'
import colors from '../misc/colors';
import ScreenTemplate from './ScreenTemplate';
import NoteMenu from './NoteMenu';

function FullNote(props) {
  const title = "What are you grateful for today?";
  const navigation = props.navigation;
  const {setNotes, setTabBarVisible} = props.route.params;
  const {id, writtenDate, quote, prompts, answers} = props.route.params.note;

  //returns prompts and associated answers (if there are answers for that prompt)
  const getNote = () => (
    prompts.map((prompt, index) => {
      if(answers[index]) {
        return (
          <View key={id+index} >
            <Text style={[styles.promptText, styles.text]}>{prompt}</Text>
            <Text style={[styles.answerText, styles.text]}>{answers[index]}</Text>
          </View>
        );
      }
    })
  )

  const handleDelete = async (id) => {
    setNotes(current =>
      current.filter(note => {
        return note.id !== id;
      }),
    );
    handleBack();
  }

  const handleBack = () => {
    setTabBarVisible(true);
    navigation.pop();
  }

  //for when user uses back button on device
  useBackHandler(() => {
    handleBack();
  })

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Pressable onPress={handleBack} android_ripple={{ color: colors.YELLOW, radius: 20, }} style={styles.backBtn}>
              <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={26} />
            </Pressable>
            <Text style={styles.date}>{writtenDate}</Text>
          </View>
          <NoteMenu handleDelete={() => handleDelete(id)}/>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.greetTitleContainer}>
            <View style={styles.quoteContainer}>
              <Text style={[styles.quote, styles.text]}>{quote.text}</Text>
              <Text style={[styles.quote, styles.text]}>- {quote.author}</Text>
            </View>
            <Text style={[styles.text, styles.title]}>{title}</Text>
            <MaterialCommunityIcons 
              name="cards-diamond-outline" 
              color={'#fff'} 
              size={26} 
              style={styles.icon}
            />
          </View>
          {getNote()} 
        </ScrollView>
      </View>
    </ScreenTemplate>
  )
}
export default FullNote;

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width - 40,
    marginTop: 30,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.5,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginVertical: 15,
  },
  backBtn: {
    height: 40,
    width: '20%',
    paddingTop: 5,
  },
  text: {
    color: colors.LIGHT,
  },
  date: {
    color: colors.LIGHT,
    fontSize: 18,
    fontFamily: 'Montserrat-LightItalic',
  },
  greetTitleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Courgette-Regular',
    marginTop: 10,
    marginBottom: 10,
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
  answerText: {
    paddingBottom: 30,
    borderBottomColor: 'rgba(248, 248, 255, 0.3)',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  deleteBtn: {
    height: 30,
    width: '20%',
    borderRadius: 7,
    padding: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.LIGHT,
  },
})