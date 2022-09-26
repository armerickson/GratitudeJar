import { StyleSheet, Text, View, Dimensions, TouchableOpacity} from 'react-native'
import React, { useState, useEffect } from 'react';
import {Calendar} from 'react-native-calendars';
import ScreenTemplate from './ScreenTemplate';
import colors from '../misc/colors';
import Note from './Note';


function CalendarPage(props) {
  const {
    navigation, 
    notes, 
    setNotes, 
    todaysNumericalDate, 
    currentDateObj, 
    setTabBarVisible
  } = props;

  const oldestEntryDate = notes.length ? notes[0].numericalDate : todaysNumericalDate;
  const oldestEntryDateObj = notes.length ? notes[0].date : currentDateObj;
  const [leftArrowDisabled, setLeftArrowDisabled] = useState(false);
  const [selectedDay, setSelectedDay] = useState(todaysNumericalDate); //day pressed

  useEffect(() => {
    if(oldestEntryDateObj.year === currentDateObj.year && 
      oldestEntryDateObj.month === currentDateObj.month) setLeftArrowDisabled(true);
  }, [])

  //disable left arrow if reach year and month of oldest entry
  const disableArrowIfOutOfRange = ({month, year}) => {
    oldestEntryDateObj.year === year &&
    oldestEntryDateObj.month === month ? 
      setLeftArrowDisabled(true) : 
      setLeftArrowDisabled(false);
  }

  //creates markedDates object for each note and current day
  //markedDates obj is used as Calendar prop
  const getMarkedDates = () => {
    const markedDates = {};

    markedDates[todaysNumericalDate] = { //current date is marked by yellow circle
      selected: true,
      selectedColor: colors.YELLOW,
    }

    notes.map(note => {
      //if note was written at current date, mark by yellow circle AND dot
      note.numericalDate === todaysNumericalDate ? 
      markedDates[note.numericalDate] = {
        selected: true,
        selectedColor: colors.YELLOW,
        marked: true, 
        dotColor: colors.LIGHT,
      } :
      //note not current date, mark yellow dot
      markedDates[note.numericalDate] = { 
        marked: true, 
        dotColor: colors.YELLOW,
      }
    }) 
    return markedDates;
  }

  //returns Note if theres an entry written on the selected day
  const SelectedEntry = ({date}) => (
    notes.map(note => {
      if(note.numericalDate === date) {
        return (
          <Note item={note} onPress={() => openNote(note)} key={note.numericalDate}/>
        )
      }
    })
  )

  const openNote = (note) => {
    setTabBarVisible(false);

    navigation.push('FullNote',
      { note: note, 
        setTabBarVisible: setTabBarVisible, 
        setNotes: setNotes,
      }
    )
  }
    
  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <Calendar
          style={styles.calendar}
          theme={{
            calendarBackground: 'transparent',
            monthTextColor: colors.LIGHT,
            dayTextColor: colors.LIGHT,
            selectedDayBackgroundColor: colors.YELLOW,
            selectedDotColor: '#ffffff',
            arrowColor: colors.LIGHT,
            disabledArrowColor: 'rgba(248, 248, 255, 0.2)',
            textSectionTitleColor: colors.LIGHT,
            textDisabledColor: 'rgba(248, 248, 255, 0.5)',
          }}
          minDate={oldestEntryDate}
          maxDate={todaysNumericalDate}
          onDayPress={day => setSelectedDay(day.dateString)}
          onMonthChange={month => disableArrowIfOutOfRange(month)}
          disableArrowLeft={leftArrowDisabled}
          markedDates={getMarkedDates()}
        />
        <SelectedEntry date={selectedDay}/>
      </View>
    </ScreenTemplate>
  )
}
export default CalendarPage;

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    width: width - 40,
  },
  calendar: {
    paddingBottom: 20,
    borderBottomColor: 'rgba(248, 248, 255, 0.5)',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});