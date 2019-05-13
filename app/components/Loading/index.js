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
import NavigationService from '../../../NavigationService'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../axios'


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
          } else {
              alert("Permission Denied");
          }
      } catch (err) {
          console.warn(err)
      }
  }
  checkUserToken = async() => {

    await axios.get(`/users/auth`)
      .then(res => {
        console.log('res in loading', res)
        if(res.status == 200)
        {
          console.log('loading to maincontainer')
          NavigationService.navigate('MainContainer', {})
          // this.props.navigation.navigate('MainContainer')
        }
        else{
          console.log('status not 200')
        }
      })
      .catch(err => {
        console.log('Error sending authenticating request', err)
      })
  }
  requestLocationPermission();
  checkUserToken();
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