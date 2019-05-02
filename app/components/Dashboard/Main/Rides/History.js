import React, { Component } from 'react'
import { 
  Text,
  View,
  //Button,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Button, Surface,} from 'react-native-paper';

export default class History extends Component {
  signOut = async () => {
    await AsyncStorage.removeItem('id_token')
    .then(() => {
      console.log('signing out user...')
      this.props.navigation.navigate('Login')
    })
    .catch(err => console.log('error in signing out user'))
  }
  render() {
    return (
      <View style = {styles.container}>
        <Text> History </Text>
        <Button  mode="contained" 
            color = "#7963b6"
            onPress={this.signOut}>SIGN OUT
          </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

})

