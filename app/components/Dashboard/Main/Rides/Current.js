import React, { Component } from 'react'
import firebase from 'react-native-firebase';
import { NavigationActions ,} from 'react-navigation'
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { Button, Surface,} from 'react-native-paper';
import axios from 'axios'


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

export default class Current extends Component {

  constructor(props) {
      super(props)
      this._handleBackHandler = this._handleBackHandler.bind(this);
      this.route = "http://192.168.137.1:5570"
      this.token = null
  }


  componentDidMount()
  {
  
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#7963b6');
    });
    BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);
  }
  
  componentWillUnmount()
  {
  
    this._navListener.remove();
  
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackHandler);
  }
  
  _handleBackHandler = () => {
    BackHandler.exitApp();
    }


  signOut = async () => {
    const token = await AsyncStorage.getItem('id_token')
    console.log('current token : ', token)
    await AsyncStorage.removeItem('id_token')
    .then(() => {
      console.log('signing out user...')
      this.props.navigation.navigate('login')
    })
    .catch(err => console.log('error in signing out user'))
  }

  render() {
    return (
      <View style = {styles.container}>
        <SafeAreaView style={[
           { backgroundColor: '#7963b6' }]}>
                <StatusBar
                barStyle="light-content"
                backgroundColor="#7963b6"
                />
            </SafeAreaView>


        <Surface style={styles.surface}>
          <Button  mode="contained" 
            color = "#7963b6"
            onPress={this.signOut}>SIGN OUT
          </Button>
        </Surface>

        <View style = {styles.buttonContainer}>
          <Button mode = "contained" style = {styles.offerRide}
            onPress = {() => {this.props.navigation.navigate('Offer')}}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }}>OFFER A RIDE</Text>

          </Button>

          <Button mode = "outlined" style = {styles.findRide} dark = 'false'
            onPress = {() => {this.props.navigation.navigate('Search')}}>
            <Text style = {{color: '#7963b6', fontWeight: 'bold' }}>FIND A RIDE</Text>
          </Button>
        </View>    
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

    fbButton:{
      height: 35,
      backgroundColor: '#7963b6',
      width: 250,
      marginTop: 10,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },

    surface: {
      padding: 8,
      height: '70%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },

    buttonContainer :{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'pink',
    },

    offerRide: {
      borderRadius: 30,
      width: 300,
      height: 40,
      backgroundColor: "#7963b6",
      justifyContent: 'center',

    },

    findRide: {
      borderRadius: 30,
      width: 300,
      height: 40,
      backgroundColor: "#fff",
      marginTop: 10,
      justifyContent: 'center'

    },
  
  
  })
