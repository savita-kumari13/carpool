import React, { Component } from 'react'
import { Button, Surface,} from 'react-native-paper';
import axios from '../../../axios'
import config from '../../../../config/constants'
import NavigationService from '../../../../../NavigationService'
import AsyncStorage from '@react-native-community/async-storage'


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
        noOfferedRides: false,
        noBookedRides: false,
        currentUserId: null,
        offeredRides: [],
        bookedRides : [],
        offeredRideVisible: false,
        bookedRideVisible : false,
        offerRideButton: false,
        searchRideButton: false,
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

  getCurrentRide= async () =>{
    await axios.get('/users')
    .then(res => {
      const resData = res.data
      if(resData.status){
        if(resData && resData.response && resData.response.user)
        {
          this.setState({
            currentUserId: resData.response.user._id
          })
        }
      }
      else{
        ToastAndroid.show(resData.messages.join(', '), ToastAndroid.SHORT);
        this.props.navigation.navigate('Login')
      }
    })
    .catch(err => {
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
      console.log('err sending get current user request ', err)
    })

    await axios.get('rides/current_offered_ride')
    .then(res =>{
      const resData = res.data
      if(resData.status){
        if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
          this.setState({
            offeredRides: resData.response.rides,
            offeredRideVisible: true,
            refreshing: false,
            noOfferedRides: false,
            offerRideButton: false,
          })
        }
        else{
          this.setState({
            offeredRideVisible: false,
            refreshing: false,
            noOfferedRides: true,
            offerRideButton: true
          })
          console.log('empty offered rides')
        }
      }
      else{
        ToastAndroid.show(resData.messages.join(', '), ToastAndroid.SHORT);
      }
    })
    .catch(err => {
      this.setState({
        offeredRideVisible: false,
        refreshing: false,
        noOfferedRides: true,
        offerRideButton: true
      })
      console.log('error sending current_offered_rides request', err)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    })


    axios.get('rides/current_searched_ride')
    .then(res =>{
      const resData = res.data
      if(resData.status){
        if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
          this.setState({
            bookedRides: resData.response.rides,
            bookedRideVisible: true,
            refreshing: false,
            noBookedRides: false,
            searchRideButton: false,
          })
        }
        else{
          this.setState({
            bookedRideVisible: false,
            refreshing: false,
            noBookedRides: true,
            searchRideButton: true
          })
          console.log('empty booked rides')
        }
      }
      else{
        ToastAndroid.show(resData.messages.join(', '), ToastAndroid.SHORT);
      }
    })
    .catch(err => {
      this.setState({
        bookedRideVisible: false,
        refreshing: false,
        noBookedRides: true,
        searchRideButton: true
      })
      console.log('error sending current_searched_rides request', err)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    })
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
        ToastAndroid.show('Starting your ride', ToastAndroid.SHORT);
      }
      else{
        ToastAndroid.show('Unable to start ride', ToastAndroid.SHORT);
      }
    }).catch(err => {
      console.log('error sending start ride request ', err)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
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
        ToastAndroid.show('Ride has been cancelled', ToastAndroid.SHORT);
      }
      else{
        ToastAndroid.show('Unable to cancel ride', ToastAndroid.SHORT);
      }
    }).catch(err => {
      console.log('error sending cancel offered ride request ', err)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    })
  }

  cancelOfferedRideAlert(rideId){
    Alert.alert(
      '','Confirm cancel ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.cancelOfferedRide(rideId)},
      ],
      {cancelable: false},
    );
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
        }
        ToastAndroid.show('Ride completed', ToastAndroid.SHORT);
      }
      else{
        ToastAndroid.show('Please click again to complete your ride.', ToastAndroid.SHORT);
      }
    }).catch(err => {
      console.log('error sending complete offered ride request ', err)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
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
        ToastAndroid.show('Ride has been cancelled', ToastAndroid.SHORT);
      }
      else{
        ToastAndroid.show('Please click again to cancel your ride.', ToastAndroid.SHORT);
      }
    }).catch(err => {
      console.log('error sending cancel request ', err)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    })
  }

  cancelBookedRideAlert(rideId){
    Alert.alert(
      '','Confirm cancel ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.cancelBookedRide(rideId)},
      ],
      {cancelable: false},
    );
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
        }
        ToastAndroid.show('Ride completed', ToastAndroid.SHORT);
      }
        else{
          ToastAndroid.show('Please click again to complete your ride.', ToastAndroid.SHORT);
        }
      }).catch(err => {
        console.log('error sending complete offered ride request ', err)
        ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
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
      StatusBar.setBackgroundColor(config.COLOR);
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

  async offeredRidePlan(item) {
    try {
      await AsyncStorage.setItem('offered_ride', JSON.stringify(item))
      this.props.navigation.navigate('OfferedRide')
    } catch (error) {
      console.log("error in async storgae ", error)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    }
  }
  
  async bookedRidePlan(item){
    try {
      await AsyncStorage.setItem('booked_ride', JSON.stringify(item))
      this.props.navigation.navigate('BookedRide')
    } catch (error) {
      console.log("error in async storgae ", error)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    }
  }

  renderOfferedRide = ({item}) => {
    if(item){
      return(
        <View style = {styles.currentRideView} >
        <TouchableOpacity onPress = {() => this.offeredRidePlan(item)}>
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
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
            <Text style = {{ color: config.TEXT_COLOR, fontWeight: 'bold' }}>{item.offered_ride_passengers_no} seats available</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
            {item.offered_user.status == config.STATUS.PENDING &&
            <TouchableOpacity onPress = {() => this.startRide(item._id)}>
              <Text style = {{ color: config.COLOR, fontWeight: 'bold', fontSize: 13,  }}
              >START RIDE</Text>
            </TouchableOpacity>}

            {item.offered_user.status == config.STATUS.PENDING &&
            <TouchableOpacity onPress = {() => this.cancelOfferedRideAlert(item._id)}>
              <Text style = {{ color: '#e60000', fontWeight: 'bold', fontSize: 13,  }}
              >CANCEL RIDE</Text>
            </TouchableOpacity>}  

            {item.offered_user.status == config.STATUS.ON_GOING &&
              <Text style = {{ color: '#339933', fontWeight: 'bold', fontSize: 13,  }}
              >ON THE WAY</Text>}

            {item.offered_user.status == config.STATUS.ON_GOING &&
            <TouchableOpacity onPress = {() => this.offeredRideCompleted(item._id)}>
              <Text style = {{ color: config.COLOR, fontWeight: 'bold', fontSize: 13,  }}
              >RIDE COMPLETED ?</Text>
            </TouchableOpacity>}  
          </View>
        </View>
    )
    }   
  }

renderBookedRide = ({item}) => {
    if(item) {
      return(
        <View style = {styles.currentRideView}>
        <TouchableOpacity 
          onPress = {() => this.bookedRidePlan(item)}>
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
          </TouchableOpacity>
          <View style={{
            marginTop: 25,
            marginLeft: -10,
            marginRight: -10,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
          }}/>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
              <Text style = {{ color: config.TEXT_COLOR, fontWeight: 'bold' }}>Car Owner: </Text>
              <Text style = {{ color: config.TEXT_COLOR, fontWeight: 'bold'}}>{item.offered_user.name} </Text>
            </View>
            {item.booked_user.map(user => {
            if(user._id.toString() == this.state.currentUserId && user.status == config.STATUS.PENDING)
            return(
              <TouchableOpacity key = {user._id} onPress = {() => this.cancelBookedRideAlert(item._id)}>
                <Text style = {{ color: '#e60000', fontWeight: 'bold', fontSize: 13,  }}
                >CANCEL BOOKING</Text>
              </TouchableOpacity>
            )})}
          </View>

          {item.booked_user.map(user => {
            if(user._id.toString() == this.state.currentUserId && user.status == config.STATUS.ON_GOING)
            return(
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}} key = {user._id}>
                <Text style = {{ color: '#339933', fontWeight: 'bold', fontSize: 13,  }}
                >ON THE WAY</Text>
                <Text style = {{ color: config.COLOR, fontWeight: 'bold', fontSize: 13,  }}
                onPress = {() => this.bookedRideCompleted(item._id)}
                >RIDE COMPLETED ?</Text>
              </View>
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
      <SafeAreaView style={[{backgroundColor: config.COLOR }]}>
        <StatusBar
        barStyle="light-content"
        backgroundColor={config.COLOR}
        />
      </SafeAreaView>

        {this.state.offeredRideVisible &&
        <View style = {styles.yourOfferedRideView}>
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


        {this.state.noOfferedRides && this.state.noBookedRides && <Surface style={styles.surface}>
        <Text style = {{
          fontWeight: 'bold',
          fontFamily: "sans-serif-medium",
          fontSize: 34,
          fontWeight: 'bold',
          color: config.COLOR,}}>
          Going somewhere!!
        </Text>
        <Text style = {{
          fontWeight: 'bold',
          fontFamily: "sans-serif-medium",
          fontSize: 25,
          fontWeight: 'bold',
          color: config.TEXT_COLOR,
          marginTop: 20,}}>
          Offer or Search rides
        </Text>
        </Surface>}

        {this.state.offerRideButton && this.state.searchRideButton && <View style = {styles.buttonContainer}>
          <Button mode = "contained" style = {styles.offerRide}
            onPress = {() => {this.props.navigation.navigate('Offer')}}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }}>OFFER A RIDE</Text>

          </Button>

          <Button mode = "outlined" style = {styles.findRide} dark = 'false'
            onPress = {() => {this.props.navigation.navigate('Search')}}>
            <Text style = {{color: config.COLOR, fontWeight: 'bold' }}>FIND A RIDE</Text>
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
      color: config.TEXT_COLOR,
      fontWeight: 'bold',
      fontSize: 20,
      // fontFamily: "sans-serif-condensed",
    },

    yourOfferedRideView: {
      backgroundColor: config.COLOR,
      marginTop: 20,
      marginHorizontal: 20,
      padding: 10,

    },

    yourBookingView: {
      backgroundColor: config.COLOR,
      marginTop: 30,
      marginHorizontal: 20,
      padding: 10,

    },

    location: {
      fontSize: 18,
      fontWeight: 'bold',
      color: config.TEXT_COLOR,
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
      backgroundColor: config.COLOR,
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
