import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ListView,
  FlatList,
  ScrollView,
  Image, 
  ToastAndroid,
  ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../../../axios'

import ArrowIcon from 'react-native-vector-icons/Ionicons'
import SearchIcon from 'react-native-vector-icons/Ionicons'
import RupeeIcon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from '../../../../config/constants'

export default class SearchList extends Component {

  constructor(props){
    super(props)
    this.state = {
      uri: config.API_HOST + '/user_default_profile_photo.jpg',
      rideId: null,
      leaveLocation: '',
      goingLocation: '',
      day: '',
      date: new Date(),
      hours : new Date().getHours(),
      minutes : new Date().getMinutes(),
      todayTommorow: false,
      passengerNo: 0,
      ridesListVisible: false,
      noRides: false,
      isLoadingRides: false,
      isLoading: false,
      rides: [],
      preferences: [],

      monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],

      daysNames : ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        ], 
    }
  }

  componentDidMount() {
    gettingSearchedRideData = async() =>{  
      const leavingFromLocationToParse = await AsyncStorage.getItem('leave_from_location')
      const goingToLocationToParse = await AsyncStorage.getItem('going_to_location')
      const leavingFromLongitudeToParse = await AsyncStorage.getItem('leave_from_longitude')
      const leavingFromLatitudeToParse = await AsyncStorage.getItem('leave_from_latitude')
      const goingToLongitudeToParse = await AsyncStorage.getItem('going_to_longitude')
      const goingToLatitudeToParse = await AsyncStorage.getItem('going_to_latitude')
      const pickedDateToParse = await AsyncStorage.getItem('searched_ride_date_time')
  
      const leavingFromLocation = JSON.parse(leavingFromLocationToParse)
      const goingToLocation = JSON.parse(goingToLocationToParse)
      const leavingFromLongitude = JSON.parse(leavingFromLongitudeToParse)
      const leavingFromLatitude = JSON.parse(leavingFromLatitudeToParse)
      const goingToLongitude = JSON.parse(goingToLongitudeToParse)
      const goingToLatitude = JSON.parse(goingToLatitudeToParse)
      const pickedDateString = JSON.parse(pickedDateToParse)
      const pickedDate = new Date(pickedDateString)
      const today = new Date()
      if(pickedDate.getDate() == today.getDate()){
        this.setState({
          day: 'Today',
          todayTommorow: true
        })
      }
      if(pickedDate.getDate() == today.getDate() + 1){
        this.setState({
          day: 'Tommorow',
          todayTommorow: true
        })
      }
  
      this.setState({
        leaveLocation: leavingFromLocation,
        goingLocation: goingToLocation,
        date: pickedDate,
        hours: ((pickedDate.getHours()) < 10? '0': '') + pickedDate.getHours(),
        minutes: ((pickedDate.getMinutes()) < 10? '0': '') + pickedDate.getMinutes()
      })
  
      const searchedRide = {
        leaving_from_coordinates: [leavingFromLongitude, leavingFromLatitude],
        going_to_coordinates: [goingToLongitude, goingToLatitude],
        searched_ride_date_time: pickedDate
      }
      this.setState({
        isLoadingRides: true
      })
  
      await axios.post(`/rides/search_ride`, searchedRide,
      ).then(res => {
        const resData = res.data
        if(resData.status){
          if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
            this.setState({
              rides: res.data.response.rides,
              ridesListVisible: true,
              isLoadingRides: false,
              noRides: false,
            });
          }
          else{
            this.setState({
              bookedRideVisible: false,
              noRides: true,
              isLoadingRides: false
            })
          }
        }
        else{
          this.setState({
            isLoadingRides: false
          })
          ToastAndroid.show('Error while getting rides', ToastAndroid.SHORT)
        }
      }).catch(err => {
        this.setState({
          isLoadingRides: false
        })
        console.log('error sending search request : ', err)
        ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
      })
    }

    gettingSearchedRideData()   
  }

  async saveUserRideInfo(item){
    this.setState({
      isLoading: true
    })
    try {
      await AsyncStorage.setItem('ride_id', JSON.stringify(item._id))
      await AsyncStorage.setItem('leave', JSON.stringify(item.pick_up_name))
      await AsyncStorage.setItem('going', JSON.stringify(item.drop_off_name))
      await AsyncStorage.setItem('price', JSON.stringify(item.offered_ride_price))
      await AsyncStorage.setItem('passenger', JSON.stringify(item.offered_ride_passengers_no))
      await AsyncStorage.setItem('info', JSON.stringify(item.offered_ride_info))
      await AsyncStorage.setItem('date', JSON.stringify(this.state.date))
      await AsyncStorage.setItem('user_name', JSON.stringify(item.offered_user.name))
      await AsyncStorage.setItem('phone_number', JSON.stringify(item.offered_user.phone_number))
      await AsyncStorage.setItem('preferences', JSON.stringify(item.offered_user.preferences))
      await AsyncStorage.setItem('avatar', JSON.stringify(item.offered_user.avatar))
      await AsyncStorage.setItem('car', JSON.stringify(item.offered_user.car))
      await AsyncStorage.setItem('booked_user', JSON.stringify(item.booked_user))
      await AsyncStorage.setItem('bio', JSON.stringify(item.offered_user.bio))
      this.props.navigation.navigate('UserAndRideInfo')
      this.setState({
        isLoading: false
      })
    } catch (error) {
      this.setState({
        isLoading: false
      })
      console.log('error in async storage ', error)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    }
  }

  renderRide = ({item}) => {
    if(item.offered_ride_passengers_no != 0){
      return(
        <TouchableOpacity style = {styles.rideItemView} onPress = {() => {this.saveUserRideInfo(item)}}>
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
                <Text style={{color: config.TEXT_COLOR, fontSize: 16, marginLeft: -5, flexWrap: 'wrap'}}>{item.pick_up_name}</Text>
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
                <Text style={{color: config.TEXT_COLOR, fontSize: 16, marginLeft: -5,}}>{item.drop_off_name}</Text>
              </View>
            </View>
          </View>

          <View style={{
            marginTop: 10,
            // marginHorizontal: -10,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 0.5,
        }}/>

          <View style = {{flexDirection: "row", marginTop: 10, justifyContent: 'space-between' }} >
            <View style = {{flexDirection: "row", }}>
              <Image style={styles.avatar} source={{uri: config.API_HOST + '/' + item.offered_user.avatar }}/>
              <Text style = {{
                fontSize: 16,
                marginTop: 10,
                marginLeft: 10,
                fontWeight: 'bold',
                color: config.TEXT_COLOR,
                }}>{item.offered_user.name}</Text>
            </View>

            <View style = {{flexDirection: "row", paddingTop: 5, paddingRight: 10 }}>
              <RupeeIcon name = 'rupee' size = {14} color = {config.TEXT_COLOR} style = {{marginTop: 7}} />
              <Text style = {{
                marginLeft: 2,
                fontSize: 20,
                fontWeight: 'bold',
                color: config.TEXT_COLOR,
                fontFamily: "sans-serif-condensed",
                }}>{item.offered_ride_price}</Text>
            </View>
          </View>
        </TouchableOpacity>
    )
    }
  }

   
  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <View style = {{flexDirection: "row", marginTop: 20,marginBottom: 5,}}>
          <Text style = {styles.searchLocationText}>{this.state.leaveLocation}</Text>
          <ArrowIcon name = 'md-arrow-forward' size = {20} color = {config.TEXT_COLOR} style = {{marginRight: 10}}>
          </ArrowIcon>
          <Text style = {styles.searchLocationText}>{this.state.goingLocation}</Text>
        </View>

        {this.state.todayTommorow &&  <View style = {{marginTop: 20}}>
          <Text 
            style = {styles.date}>{this.state.day}, {this.state.hours}:{this.state.minutes}
          </Text>
        </View>}
    
        {!this.state.todayTommorow && <View style = {{marginTop: 20}}>
          <Text 
            style = {styles.date}>
            {this.state.daysNames[this.state.date.getDay()]}, {this.state.date.getDate()} {this.state.monthNames[this.state.date.getMonth()]}, {this.state.hours}:{this.state.minutes}
          </Text>
        </View>}
        {this.state.isLoadingRides && <ActivityIndicator size="large" />}
        {this.state.ridesListVisible && 
        <FlatList
          data={this.state.rides}
          renderItem={this.renderRide}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle = {{marginVertical: 30, paddingBottom: 20}}
          keyExtractor={(ride) => { return ride._id; }}
        /> }
        {this.state.isLoading && <ActivityIndicator size="large" />}
        {this.state.noRides &&
        <View style={{flex: 1, alignItems: 'center'}}>
          <SearchIcon name = 'ios-search' size = {100} style = {{marginTop: 90,}} color = {config.TEXT_COLOR}/>
          <Text style = {{ 
            color: config.TEXT_COLOR,
            fontWeight: 'bold',
            fontSize: 35,
            marginTop: 30,
            fontFamily: "sans-serif-medium",}}>No rides yet!</Text>
        </View>}
      </ScrollView>     
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
      // showsVerticalScrollIndicator: false
    },

  date: {
    color: '#527a7a',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: "sans-serif-medium",
  },

  rideItemView: {
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 63,
    borderWidth: 4,
  },

  searchLocationText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: config.TEXT_COLOR,
    // fontFamily: 'sans-serif-medium',
  },

  offerLocationText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: config.TEXT_COLOR,
    // fontFamily: 'Roboto-Medium',
  },

  location: {
    fontSize: 18,
    fontWeight: 'bold',
    color: config.TEXT_COLOR,
    flexWrap: 'wrap',
},
  
  })
    
