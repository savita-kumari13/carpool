import React, { Component } from 'react'
import firebase from 'react-native-firebase'
import { Notification, NotificationOpen  } from 'react-native-firebase'
import config from '../../config/constants'

import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    PermissionsAndroid,
    StatusBar,
    Image,
} from 'react-native';

import {Geolocation, } from 'react-native-geolocation-service';
import NavigationService from '../../../NavigationService'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../axios'
import { StackViewTransitionConfigs } from 'react-navigation';


export default class Loading extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      timePassed: false,
      isValid: false
    }
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
              },
              (error) => {
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
          } else {
              alert("Permission Denied");
          }
      } catch (err) {
          console.warn(err)
      }
  }

  checkUserToken = async () => {
    setTimeout( async () => {
      await axios.get(`/users/auth`)
      .then(res => {
        if(res.status == 200)
        {
          NavigationService.navigate('MainContainer', {})
        }
        else{
        }
      })
      .catch(err => {
      })
    }, 1000)
  }

  checkMessagingPermission = async() => {
    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
      } else {
        firebase.messaging().requestPermission()
        .then(() => { 
        })
        .catch(error => {
        });
      } 
    });
  }

  requestLocationPermission();
  checkUserToken();
  checkMessagingPermission();

  this.notificationListener = firebase.notifications().onNotification((notification) => {
  });

  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    const action = notificationOpen.action;
    const notification = notificationOpen.notification;

    const localNotification = new firebase.notifications.Notification({
      sound: 'ringtone',
      show_in_foreground: true,
    })
    .setSound('ringtone.mp3')
    .setNotificationId(notification.notificationId)
    .android.setPriority(firebase.notifications.Android.Priority.High);
  
    firebase.notifications()
    .displayNotification(localNotification)
    .catch(err => {})
  });


  firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification; 
        }
      });
}

componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}

  render() 
  {
    return (
      <View style={styles.container}>

        <Image style={styles.logo} source={{uri: config.API_HOST + '/app_icon.png' }}/>
        <Text style = {styles.text}>Stay flexible, drive together</Text>

        <StatusBar
          barStyle="light-content"
          backgroundColor= {config.COLOR}
        />
        {/* <ActivityIndicator size="large" color="#0000ff"/> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: config.COLOR,
      paddingTop: 250,
    },

    logo: {
      width: 110,
      height: 80,
    },

    text: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginTop: 30,
    }
  })