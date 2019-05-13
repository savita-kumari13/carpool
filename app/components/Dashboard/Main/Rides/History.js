import React, { Component } from 'react'
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
} from 'react-native'
import axios from '../../../axios'
import config from '../../../../config/constants'
import AsyncStorage from '@react-native-community/async-storage'
import { Button, Surface,} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class History extends Component {
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
      monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],

      daysNames : ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
      ], 
    }
    this._handleBackHandler = this._handleBackHandler.bind(this);
}

getHistoryRide(){
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

  axios.get('rides/history_offered_ride')
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


  axios.get('rides/history_searched_ride')
  .then(res =>{
    console.log('history searched rides ', res.data)
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


  willFocus = this.props.navigation.addListener(
    'willFocus', () => {
      this.getHistoryRide();
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
    this.getHistoryRide()
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
          <Text style = {{ color: '#054752', fontWeight: 'bold' }}>Ride completed</Text>
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
          if(user._id.toString() == this.state.currentUserId && user.status == config.STATUS.COMPLETED)
          return(
            <Text key = {user._id} style = {{ color: '#054752', fontWeight: 'bold',  marginTop: 10, }}>Ride completed</Text>
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
        <SafeAreaView style={[{ backgroundColor: '#7963b6' }]}>
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
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  date: {
    color: '#054752',
    fontWeight: 'bold',
    fontSize: 20,
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


})

