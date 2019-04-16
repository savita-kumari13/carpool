import React, { Component } from 'react';
import firebase from 'react-native-firebase'

import { 
      createStackNavigator,
      createAppContainer
} from  'react-navigation';

import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  PermissionsAndroid,
  Linking,
  
} from 'react-native';

import Dashboard from './app/components/Dashboard';
import Loading from './app/components/Loading';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';
import Main from './app/components/Dashboard/Main';
import PhoneAuth from './app/components/PhoneAuth';

import {Geolocation, } from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage'


class App extends Component {

  constructor(props)
  {
    super(props);

  }

    componentDidMount = () => {
      requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                    title: 'Location Access Required',
                    message: 'PoolCar needs to Access your location',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                })
            if (granted === PermissionsAndroid.RESULTS.GRANTED)
            {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                },
                (error) => {
                    console.log('error getting current location', error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
              console.log('You can use the location');
              
              await AsyncStorage.getItem('id_token')
              .then((token) => {
                if(token != null && token != undefined && token != 'null'){
                  console.log('type of token : ', typeof token)
                  console.log('navigating to main container....')
                  this.props.navigation.navigate('mainContainer')
                }
                else{
                  this.props.navigation.navigate('login') 
                }  
              })
              .catch(err => console.log('error getting token in loading page : ', err))
            } else {
                alert("Permission Denied");
            }
        } catch (err) {
            console.warn(err)
        }
    }
    requestLocationPermission();

      // firebase.auth().onAuthStateChanged((user) => {
      //   if(user)
      //   {
      //     console.log('user logged in as', user)
      //   }
      //   this.props.navigation.navigate(user ? 'mainContainer' : 'login')
      // })
  }



  render() 
  {
    return (
        <View style={styles.container}>
            <Text>Loading</Text>
            <ActivityIndicator size="large" />
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  })


const AppStackContainer = createStackNavigator(
  {
    home: App,
    signup: SignUp,
    login: Login,
    dashboard: Dashboard,
    mainContainer: MainContainer,
    phoneAuth: PhoneAuth,
  },

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

)

export default AppContainer = createAppContainer(AppStackContainer)
