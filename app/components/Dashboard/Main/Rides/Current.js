import React, { Component } from 'react'
import { Button, Surface,} from 'react-native-paper';
import axios from '../../../axios'
import NavigationService from '../../../../../NavigationService'


import { 
    Text,
    View,
    BackHandler,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    ScrollView,
    Alert,
    RefreshControl ,
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Current extends Component {
  constructor(props) {
      super(props)

      this.state = {
        bookedRideVisible : false,
        cancelRide: false,
        refreshing: false,
        rides : [],
        currentPosition: 0,
        monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],

        daysNames : ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        ], 
      }

      this._handleBackHandler = this._handleBackHandler.bind(this);
  }
  
  getCurrentRide(){
    axios.get('rides/current_ride')
    .then(res =>{
      const resData = res.data
      console.log('ok rides : ', res)
      if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
        this.setState({
          rides: resData.response.rides,
          bookedRideVisible: true,
          refreshing: false
        })
        console.log('receiving....')
      }
      else{
        this.setState({
          bookedRideVisible: false,
          refreshing: false
        })
        console.log('emptyyyyyy booked rides')
      }
    })
    .catch(err => console.log('not ok', err))
  }

  componentDidMount()
  {
    console.log('componentDidMount')
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#7963b6');
    });
    BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);
  }

  willFocus = this.props.navigation.addListener(
    'willFocus', () => {
      console.log('willFocus')
      this.getCurrentRide();
    }
  );
  
  componentWillUnmount()
  {
    this._navListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackHandler);
  }
  
  _handleBackHandler = () => {
    BackHandler.exitApp();
    }

  cancelBooking(rideId){
    const data = {
      ride_id: rideId,
    }
    axios.post('/rides/cancel_or_completed', data)
    .then(res => {
      const resData = res.data
      console.log(res)
      if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
        this.setState({
          rides: resData.response.rides,
          bookedRideVisible: true,
          refreshing: false
        })
      }
      console.log('cancelRide ', this.state.cancelRide)

    }).catch(err => {
      console.log('error sending cancel request ', err)
    })
  }

  rideCompleted(rideId){
    const data = {
      ride_id: rideId,
    }
    axios.post('/rides/cancel_or_completed', data)
    .then(res => {
      const resData = res.data
      console.log(res)
      if(resData &&  resData.status == true){
        this.setState({
          cancelRide: true,
        });
      }
      console.log('cancelRide ', this.state.cancelRide)

    }).catch(err => {
      console.log('error sending cancel request ', err)
    })
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getCurrentRide()
  }

  render() {
    console.log('In render  .... this.state.rides ', this.state.rides )
     const rides = this.state.rides.map(ride =>
      (
        <View style = {styles.currentRideView} key = {ride._id}>
          <Text 
            style = {styles.date}>
            {this.state.daysNames[new Date(ride.offered_ride_date_time).getDay()]}, {new Date(ride.offered_ride_date_time).getDate()} {this.state.monthNames[new Date(ride.offered_ride_date_time).getMonth()]} - {((new Date(ride.offered_ride_date_time).getHours()) < 10? '0': '') + new Date(ride.offered_ride_date_time).getHours()}:{((new Date(ride.offered_ride_date_time).getMinutes()) < 10? '0': '') + new Date(ride.offered_ride_date_time).getMinutes()}
          </Text>

          <View style = {{ flexDirection: 'column',}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
              <Ionicons.Button
                name="md-pin"
                backgroundColor='transparent'
                underlayColor='transparent'
                color={'#3d5c5c'}
                size={16}
              />
              <View style={{flexWrap: 'wrap', flex: 1}}>
                <Text style={{color: '#3d5c5c', fontSize: 16, marginLeft: -5, flexWrap: 'wrap'}}>{ride.pick_up_name}</Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10,}}>
              <Ionicons.Button
                name="md-pin"
                backgroundColor='transparent'
                underlayColor='transparent'
                color={'#3d5c5c'}
                size={16}
              />
              <View style={{flexWrap: 'wrap', flex: 1}}>
                <Text style={{color: '#3d5c5c', fontSize: 16, marginLeft: -5,}}>{ride.drop_off_name}</Text>
              </View>
            </View>
          </View>
          <View style={{
            marginTop: 25,
            marginLeft: -10,
            marginRight: -10,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
          }}/>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10,}}>
            <Text style = {{ color: '#527a7a', }}>Car Owner: </Text>
            <Text style = {{ color: '#527a7a',}}>{ride.offered_user.name} </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
          <Text style = {{ color: '#7963b6', fontWeight: 'bold', fontSize: 13,  }}
          onPress = {() => this.rideCompleted(ride._id)}
          >RIDE COMPLETED</Text>
          <Text style = {{ color: '#e60000', fontWeight: 'bold', fontSize: 13,  }}
          onPress = {() => this.cancelBooking(ride._id)}
          >CANCEL THIS BOOKING</Text>
          </View>
          
          {/* {ride.booked_user.map(user => {
            return (
              <Text>{user.name}</Text>
            )
          })} */}
        </View>
      ))

    return (
      <ScrollView contentContainerStyle = {styles.container}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        <SafeAreaView style={[
           { backgroundColor: '#7963b6' }]}>
                <StatusBar
                barStyle="light-content"
                backgroundColor="#7963b6"
                />
            </SafeAreaView>

        {this.state.bookedRideVisible &&
        <View style = {styles.yourBookingView}>
          <Text style = {styles.yourBookingText}>YOUR BOOKINGS</Text>
        </View>}

        {this.state.bookedRideVisible && rides}


        {!this.state.bookedRideVisible && <Surface style={styles.surface}>

        </Surface>}

        {!this.state.bookedRideVisible && <View style = {styles.buttonContainer}>
          <Button mode = "contained" style = {styles.offerRide}
            onPress = {() => {this.props.navigation.navigate('Offer')}}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }}>OFFER A RIDE</Text>

          </Button>

          <Button mode = "outlined" style = {styles.findRide} dark = 'false'
            onPress = {() => {this.props.navigation.navigate('Search')}}>
            <Text style = {{color: '#7963b6', fontWeight: 'bold' }}>FIND A RIDE</Text>
          </Button>
        </View>}    
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingBottom: 20,
      // alignItems: 'center',
      // justifyContent: 'center',
    },

    date: {
      color: '#054752',
      fontWeight: 'bold',
      fontSize: 20,
      // fontFamily: "sans-serif-condensed",
    },

    yourBookingView: {
      backgroundColor: '#7963b6',
      marginTop: 20,
      marginHorizontal: 20,
      padding: 10,

    },

    location: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#054752',
      flexWrap: 'wrap',
      marginTop: 10,
  },

    yourBookingText: {
      fontFamily: 'sans-serif-medium',
      fontSize: 14,
      color: '#fff'
    },

    currentRideView: {
      marginTop: 10,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: '#bfbfbf',
      padding: 10,
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
