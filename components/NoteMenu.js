import React, { useState } from 'react';
import {StyleSheet, Text, View, Pressable } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../misc/colors';

function NoteMenu({handleDelete}) {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const dotsMenu = () => ( //3 dots menu with delete option
    <Pressable 
      onPress={showMenu} 
      android_ripple={{ color: colors.YELLOW}} 
      style={styles.deleteBtn}
    >
      <MaterialCommunityIcons 
        name="dots-vertical" 
        color={'#fff'} 
        size={26} 
        style={styles.icon}
      />
    </Pressable>
  );

  const deleteEntry = () => {
    handleDelete(); //comes from FullNote
    hideMenu();
  }

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        anchor={dotsMenu()}
        onRequestClose={hideMenu}
      >
        <MenuItem style={styles.menuItem} onPress={deleteEntry}>
          <View style={styles.menuItemInterior}>
            <MaterialCommunityIcons name="delete-outline" color={colors.ERROR} size={26}/>
            <Text style={styles.text}>Delete</Text>
          </View>
        </MenuItem>
        <MenuDivider />
      </Menu>
    </View>
  );
};
export default NoteMenu;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  menuItem: {
    justifyContent: 'center',
  },
  menuItemInterior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
  },
})