import { 
  StyleSheet, 
  Text, 
  View,
  Dimensions, 
  FlatList, 
  TextInput, 
  TouchableWithoutFeedback, 
} from 'react-native'
import React, { useState }from 'react'
import ScreenTemplate from './ScreenTemplate';
import colors from '../misc/colors';
import Note from './Note';

function Memories(props) {
  const {notes, setNotes, setTabBarVisible, navigation} = props;
  const reversedNotes = [...notes].reverse();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(reversedNotes);

  const onChangeText = (text) => {
    setSearchText(text);

    if(!text.trim()) { //if nothing in search box, show all notes again
      setSearchText('');
      setSearchResults(reversedNotes);
    } else { //search notes for input text
      const filteredNotes = reversedNotes.filter(note => {
        for(let answer of note.answers) {
          if(answer.toLowerCase().includes(text.toLowerCase())) {
            return note;
          }
        }
      })
      setSearchResults(filteredNotes);
    }
  }

  const openNote = (note) => {
    setTabBarVisible(false);

    navigation.push('FullNote',
      { note: note, 
        setTabBarVisible: setTabBarVisible, 
        setNotes: setNotes,
      }
    )
  }

  const handleOnClear = () => setSearchResults(reversedNotes);

  //when no notes match search OR no notes in general
  const textToShowOnEmptyPage = () => {
    const hasNotes = notes.length ? 
    <Text style={[styles.emptyPageText, styles.text]}>No memories match your search</Text> :
    <Text style={[styles.emptyPageText, styles.text]}>Add a memory!</Text> 

    return (
      <View style={styles.emptyPageTextContainer}>
        {hasNotes}
      </View>
    );
  }

  //flatlist of Note components
  const renderFlatList = () => (
    <FlatList
      data={searchResults}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <Note item={item} onPress={() => openNote(item)}/>
      )}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <Text style={[styles.header, styles.text]}>My Memories</Text>
        <View style={styles.searchBarContainer}>
          <TextInput
            value={searchText}
            onChangeText={onChangeText}
            style={styles.searchBar}
            placeholder="Search here..."
            placeholderTextColor = 'rgba(250,250,250,0.3)'
            onClear={handleOnClear}
          />
        </View>
        <TouchableWithoutFeedback>
            { searchResults.length ? renderFlatList() : textToShowOnEmptyPage() }
        </TouchableWithoutFeedback>
      </View>
    </ScreenTemplate>
  )
}
export default Memories;

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginBottom: 20,
    width: width - 40,
    flex: 1,
  },
  text: {
    color: colors.LIGHT,
  },
  header: {
    fontSize: 25,
    fontFamily: 'Courgette-Regular',
    marginBottom: 10,
    paddingLeft: 5
  },
  emptyPageTextContainer: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    borderWidth: 0.5,
    borderColor: colors.LIGHT,
    height: 40,
    borderRadius: 40,
    marginBottom: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  searchBar: {
    color: 'rgba(250,250,250,255)',
    fontSize: 15,
  },
  emptyPageText: {
    fontSize: 22,
    fontFamily: 'Montserrat-Light',
    textAlign: 'center',
  },
});