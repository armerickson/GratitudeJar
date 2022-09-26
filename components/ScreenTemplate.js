import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, StatusBar } from 'react-native';
import colors from '../misc/colors';

//Gradient background for all screens
function ScreenTemplate ({ children }) {
 
  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient 
      colors={[colors.ORANGE, colors.YELLOW]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </>
  )
}
export default ScreenTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
