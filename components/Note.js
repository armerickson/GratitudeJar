import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import colors from '../misc/colors';

const Note = ({ item, onPress }) => {

  const {writtenDate, prompts, answers} = item;

  //returns truncated prompts and corresponding answers
  const NoteText = () => (
    prompts.map((prompt, index) => {
      if(answers[index]) {
        return (
          <View key={writtenDate+index}>
            <Text numberOfLines={1} style={styles.prompt}>{prompt}</Text>
            <Text numberOfLines={3} style={styles.answer}>{answers[index]}</Text>
          </View>
        )
      }
    })
  )

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.date} numberOfLines={1}>
        {writtenDate}
      </Text>
      <NoteText/>
    </TouchableOpacity>
  );
};
export default Note; 

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(248, 248, 255, 0.9)',
    width: width - 40,
    padding: 15,
    paddingRight: 30,
    borderRadius: 10,
    marginVertical: 7,
    overflow: 'hidden',
    elevation: 4,
  },
  prompt: {
    fontFamily: 'Montserrat-LightItalic',
    marginBottom: 3,
  },
  answer: {
    fontFamily: 'Montserrat-Regular',
    marginBottom: 10,
    lineHeight: 25,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.ORANGE,
    marginBottom: 10,
  },
});


