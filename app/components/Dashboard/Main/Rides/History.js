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
  TouchableOpacity
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
      noOfferedRides: false,
      noBookedRides: false,
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

getHistoryRide = async() => {
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
    })

  await axios.get('rides/history_offered_ride')
  .then(res =>{
    const resData = res.data
    if(resData.status){
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
          refreshing: false,
          noOfferedRides: true,
        })
      }
    }
    else{
      this.setState({
        offeredRideVisible: false,
        refreshing: false,
        noOfferedRides: true,
      })
      ToastAndroid.show(resData.messages.join(', '), ToastAndroid.SHORT);
    }
  })
  .catch(err => {
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  })


  axios.get('rides/history_searched_ride')
  .then(res =>{
    const resData = res.data
    if(resData.status){
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
          refreshing: false,
          noBookedRides: true,
        })
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
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  })
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
    this.getHistoryRide()
  }

  async offeredRidePlan(item) {
    try {
      await AsyncStorage.setItem('offered_ride', JSON.stringify(item))
      this.props.navigation.navigate('OfferedRide')
    } catch (error) {
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    }
  }

  async bookedRidePlan(item){
    try {
      await AsyncStorage.setItem('booked_ride', JSON.stringify(item))
      this.props.navigation.navigate('BookedRide')
    } catch (error) {
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    }
  }

renderOfferedRide = ({item}) => {
  if(item){
    return(
      <TouchableOpacity style = {styles.currentRideView}
      onPress = {() => this.offeredRidePlan(item)}>
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
          <Text style = {{ color: config.TEXT_COLOR, fontWeight: 'bold' }}>Ride completed</Text>
        </View>
      </TouchableOpacity>
  )
  }   
}

renderBookedRide = ({item}) => {
  if(item) {
    return(
      <TouchableOpacity style = {styles.currentRideView} key = {item._id}
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
            <Text key = {user._id} style = {{ color: config.TEXT_COLOR, fontWeight: 'bold',  marginTop: 10, }}>Ride completed</Text>
          )
        })}
      </TouchableOpacity>
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
        <SafeAreaView style={[{ backgroundColor: config.COLOR }]}>
          <StatusBar
          barStyle="light-content"
          backgroundColor={config.COLOR}
          />
        </SafeAreaView>

        {this.state.noOfferedRides && this.state.noBookedRides &&
        <Text style = {{
          fontWeight: 'bold',
          fontFamily: "sans-serif-medium",
          fontSize: 20,
          fontWeight: 'bold',
          color: config.TEXT_COLOR,
          marginTop: 20,
          marginHorizontal: 70}}>
          No rides completed yet!
        </Text>}

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
    color: config.TEXT_COLOR,
    fontWeight: 'bold',
    fontSize: 20,
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


})












