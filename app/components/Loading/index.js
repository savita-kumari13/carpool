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

  checkUserToken = () => {
    setTimeout( async () => {
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
    }, 2000)
  }

  checkMessagingPermission = async() => {
    firebase.messaging().hasPermission()
    .then(enabled => {
      if (enabled) {
        console.log('messaging permission enabled')
      } else {
        console.log("user doesn't have messaging permission")
        firebase.messaging().requestPermission()
        .then(() => {
          console.log('User has authorised')  
        })
        .catch(error => {
          console.log('User has rejected permissions') 
        });
      } 
    });
  }

  requestLocationPermission();
  checkUserToken();
  checkMessagingPermission();

  this.notificationListener = firebase.notifications().onNotification((notification) => {
    console.log('Notification received')
  });

  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    const action = notificationOpen.action;
    console.log('action opened', action)
    const notification = notificationOpen.notification;
    console.log('notification opened', notification)

    const localNotification = new firebase.notifications.Notification({
      sound: 'ringtone',
      show_in_foreground: true,
    })
    .setSound('ringtone.mp3')
    .setNotificationId(notification.notificationId)
    .android.setPriority(firebase.notifications.Android.Priority.High);
  
    firebase.notifications()
    .displayNotification(localNotification)
    .catch(err => console.log(err))
  });


  firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          console.log('action opened background', action)
          // Get information about the notification that was opened
          const notification = notificationOpen.notification; 
          console.log('notification opened background', notification) 
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