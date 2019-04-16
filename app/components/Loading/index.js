import React, { Component } from 'react'
import firebase from 'react-native-firebase'

import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    PermissionsAndroid,
    
} from 'react-native';

import {Geolocation, } from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage'


export default class Loading extends Component {

  constructor(props)
  {
    super(props);
    this.isValid = false

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
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                      console.log(position);
                  },
                  (error) => {
                      // See error code charts below.
                      console.log(error.code, error.message);
                  },
                  { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
              );
                console.log('You can use the location');

                const token = await AsyncStorage.getItem('id_token')
                .then((token) => {
                  if(token !== null && token !== undefined){
                    console.log('token : ', token)
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

      firebase.auth().onAuthStateChanged((user) => {
        if(user)
        {
          console.log('user logged in as', user)
        }
        this.props.navigation.navigate(user ? 'mainContainer' : 'login')
      })
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