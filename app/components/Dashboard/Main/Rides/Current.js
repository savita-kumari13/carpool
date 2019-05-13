import React, { Component } from 'react'
import { Button, Surface,} from 'react-native-paper';
import axios from '../../../axios'
import config from '../../../../config/constants'
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
    ToastAndroid,
    FlatList,
    TouchableOpacity,
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Current extends Component {
  constructor(props) {
      super(props)

      this.state = {
        currentUserId: null,
        offeredRides: [],
        bookedRides : [],
        offeredRidesNotEmpty: true,
        bookedRidesNotEmpty: true,
        offeredRideVisible: false,
        bookedRideVisible : false,
        offeredRideStatusPendingVisible: false,
        refreshing: false,
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
    axios.get('/users')
    .then(res => {
      const resData = res.data
      if(resData && resData.response && resData.response.user)
      {
        this.setState({
          currentUserId: resData.response.user._id
        })
      }
    }).catch(err => {
      console.log('err sending get current user request ', err)
    })

    axios.get('rides/current_offered_ride')
    .then(res =>{
      const resData = res.data
      if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
        this.setState({
          offeredRides: resData.response.rides,
          offeredRideVisible: true,
          refreshing: false
        })
      }
      else{
        this.setState({
          offeredRideVisible: false,
          refreshing: false
        })
        console.log('empty offered rides')
      }
    })
    .catch(err => console.log('error sending current_offered_rides request', err))


    axios.get('rides/current_searched_ride')
    .then(res =>{
      const resData = res.data
      if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
        this.setState({
          bookedRides: resData.response.rides,
          bookedRideVisible: true,
          refreshing: false
        })
      }
      else{
        this.setState({
          bookedRideVisible: false,
          refreshing: false
        })
        console.log('empty booked rides')
      }
    })
    .catch(err => console.log('error sending current_searched_rides request', err))
  }

  startRide(rideId){
    const data = {
      ride_id: rideId,
    }
    axios.post('/rides/start', data)
    .then(res => {
      const resData = res.data
      if(resData && resData.status){
        let rides=this.state.offeredRides;
        rides = rides.map(ride => {
          if(ride._id.toString() == rideId.toString()){
          ride.offered_user.status = config.STATUS.ON_GOING
          console.log('rides matched to start')
          }
          return ride
        })
        this.setState({
          offeredRides: rides,
          offeredRideVisible: true,
          refreshing: false
        })
      }
      ToastAndroid.show('Starting your ride', ToastAndroid.SHORT);
    }).catch(err => {
      console.log('error sending start ride request ', err)
    })
  }

  cancelOfferedRide(rideId){
    const data = {
      ride_id: rideId,
    }
    axios.post('/rides/cancel_offered_ride', data)
    .then(res => {
      const resData = res.data
      if(resData && resData.status){
        let rides=this.state.offeredRides;
        rides= rides.filter(ride=> { return ride._id.toString() != rideId.toString() })
        this.setState({
          offeredRides: rides,
          offeredRideVisible: true,
          refreshing: false
        })
        if(rides.length == 0){
          this.setState({
            offeredRideVisible: false
          })
        }
      }
      ToastAndroid.show('Ride has been cancelled', ToastAndroid.SHORT);
    }).catch(err => {
      console.log('error sending cancel offered ride request ', err)
    })
  }

  offeredRideCompleted(rideId){
    const data = {
      ride_id: rideId,
    }
    axios.post('/rides/offered_ride_completed', data)
    .then(res => {
      const resData = res.data
      if(resData && resData.status){
        let rides=this.state.offeredRides;
        rides= rides.filter(ride=> { return ride._id.toString() != rideId.toString() })
        this.setState({
          offeredRides: rides,
          offeredRideVisible: true,
          refreshing: false
        })
        if(rides.length == 0){
          this.setState({
            offeredRideVisible: false
          })
          ToastAndroid.show('Reached destination', ToastAndroid.SHORT);
        }
      }
      ToastAndroid.show('Ride completed', ToastAndroid.SHORT);
    }).catch(err => {
      console.log('error sending complete offered ride request ', err)
    })
  }



  cancelBookedRide(rideId){
    const data = {
      ride_id: rideId,
    }
    axios.post('/rides/cancel_booked_ride', data)
    .then(res => {
      const resData = res.data
      if(resData && resData.status){
        let rides=this.state.bookedRides;
        rides= rides.filter(ride=> { return ride._id.toString() != rideId.toString() })
        this.setState({
          bookedRides: rides,
          bookedRideVisible: true,
          refreshing: false
        })
        if(rides.length == 0){
          this.setState({
            bookedRideVisible: false
          })
        }
      }
      ToastAndroid.show('Ride has been cancelled', ToastAndroid.SHORT);
    }).catch(err => {
      console.log('error sending cancel request ', err)
    })
  }

  bookedRideCompleted(rideId){
    const data = {
      ride_id: rideId,
    }
    axios.post('/rides/booked_ride_completed', data)
    .then(res => {
      const resData = res.data
      if(resData && resData.status){
        let rides=this.state.bookedRides;
        rides= rides.filter(ride=> { return ride._id.toString() != rideId.toString() })
        this.setState({
          bookedRides: rides,
          bookedRideVisible: true,
          refreshing: false
        })
        if(rides.length == 0){
          this.setState({
            bookedRideVisible: false
          })
          ToastAndroid.show('Reached destination', ToastAndroid.SHORT);
        }
      }
      ToastAndroid.show('Ride completed', ToastAndroid.SHORT);
    }).catch(err => {
      console.log('error sending complete booked ride request ', err)
    })
  }

  willFocus = this.props.navigation.addListener(
    'willFocus', () => {
      this.getCurrentRide();
    }
  );
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
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getCurrentRide()
  }


  renderOfferedRide = ({item}) => {
    if(item){
      return(
        <View style = {styles.currentRideView} >
            <Text 
            style = {styles.date}>
            {this.state.daysNames[new Date(item.offered_ride_date_time).getDay()]}, {new Date(item.offered_ride_date_time).getDate()} {this.state.monthNames[new Date(item.offered_ride_date_time).getMonth()]} - {((new Date(item.offered_ride_date_time).getHours()) < 10? '0': '') + new Date(item.offered_ride_date_time).getHours()}:{((new Date(item.offered_ride_date_time).getMinutes()) < 10? '0': '') + new Date(item.offered_ride_date_time).getMinutes()}
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
                <Text style={{color: '#3d5c5c', fontSize: 16, marginLeft: -5, flexWrap: 'wrap'}}>{item.pick_up_name}</Text>
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
                <Text style={{color: '#3d5c5c', fontSize: 16, marginLeft: -5,}}>{item.drop_off_name}</Text>
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
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
            <Text style = {{ color: '#054752', fontWeight: 'bold' }}>{item.offered_ride_passengers_no} seats available</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
            {item.offered_user.status == config.STATUS.PENDING &&
            <Text style = {{ color: '#7963b6', fontWeight: 'bold', fontSize: 13,  }}
            onPress = {() => this.startRide(item._id)}
            >START RIDE</Text>}

          {item.offered_user.status == config.STATUS.PENDING &&
            <Text style = {{ color: '#e60000', fontWeight: 'bold', fontSize: 13,  }}
            onPress = {() => this.cancelOfferedRide(item._id)}
            >CANCEL THIS RIDE</Text>}  

          {item.offered_user.status == config.STATUS.ON_GOING &&
            <Text style = {{ color: '#339933', fontWeight: 'bold', fontSize: 13,  }}
            >ON THE WAY</Text>}

          {item.offered_user.status == config.STATUS.ON_GOING &&
            <Text style = {{ color: '#7963b6', fontWeight: 'bold', fontSize: 13,  }}
            onPress = {() => this.offeredRideCompleted(item._id)}
            >RIDE COMPLETED</Text>}  

          {item.offered_user.status == config.STATUS.COMPLETED &&
            <Text style = {{ color: '#7963b6', fontWeight: 'bold', fontSize: 13,  }}
            >RIDE COMPLETED</Text>}

          </View>
        </View>
    )
    }   
  }

renderBookedRide = ({item}) => {
    if(item) {
      return(
        <View style = {styles.currentRideView} key = {item._id}>
          <Text 
            style = {styles.date}>
            {this.state.daysNames[new Date(item.offered_ride_date_time).getDay()]}, {new Date(item.offered_ride_date_time).getDate()} {this.state.monthNames[new Date(item.offered_ride_date_time).getMonth()]} - {((new Date(item.offered_ride_date_time).getHours()) < 10? '0': '') + new Date(item.offered_ride_date_time).getHours()}:{((new Date(item.offered_ride_date_time).getMinutes()) < 10? '0': '') + new Date(item.offered_ride_date_time).getMinutes()}
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
                <Text style={{color: '#3d5c5c', fontSize: 16, marginLeft: -5, flexWrap: 'wrap'}}>{item.pick_up_name}</Text>
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
                <Text style={{color: '#3d5c5c', fontSize: 16, marginLeft: -5,}}>{item.drop_off_name}</Text>
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
            <Text style = {{ color: '#527a7a',}}>{item.offered_user.name} </Text>
          </View>

          {item.booked_user.map(user => {
            if(user._id.toString() == this.state.currentUserId && user.status == config.STATUS.PENDING)
            return(
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'flex-end'}} key = {user._id}>
                <Text style = {{ color: '#e60000', fontWeight: 'bold', fontSize: 13,  }}
                onPress = {() => this.cancelBookedRide(item._id)}
                >CANCEL THIS BOOKING</Text>
              </View>
            )

            if(user._id.toString() == this.state.currentUserId && user.status == config.STATUS.ON_GOING)
            return(
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}} key = {user._id}>
                <Text style = {{ color: '#339933', fontWeight: 'bold', fontSize: 13,  }}
                >ON THE WAY</Text>
                <Text style = {{ color: '#7963b6', fontWeight: 'bold', fontSize: 13,  }}
                onPress = {() => this.bookedRideCompleted(item._id)}
                >RIDE COMPLETED</Text>
              </View>
            )

            if(user._id.toString() == this.state.currentUserId && user.status == config.STATUS.COMPLETED)
            return(
              <Text style = {{ color: '#7963b6', fontWeight: 'bold', fontSize: 13, marginTop: 10,  }} key = {user._id}
              >RIDE COMPLETED</Text>
            )
          })}
        </View>
      )
    }
}


  render() {
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

        {this.state.offeredRideVisible &&
        <View style = {styles.yourBookingView}>
          <Text style = {styles.yourBookingText}>YOUR OFFERED RIDES</Text>
        </View>}
        {this.state.offeredRideVisible && 
        <FlatList
          data={this.state.offeredRides}
          renderItem={this.renderOfferedRide}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id}
        /> }

        {this.state.bookedRideVisible &&
        <View style = {styles.yourBookingView}>
          <Text style = {styles.yourBookingText}>YOUR BOOKINGS</Text>
        </View>}
        {this.state.bookedRideVisible && 
        <FlatList
          data={this.state.bookedRides}
          renderItem={this.renderBookedRide}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id}
        /> }


        {!this.state.bookedRideVisible && !this.state.offeredRideVisible && <Surface style={styles.surface}>

        </Surface>}

        {!this.state.bookedRideVisible && !this.state.offeredRideVisible && <View style = {styles.buttonContainer}>
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
