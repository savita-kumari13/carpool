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
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../../../axios'
import StepIndicator from 'react-native-step-indicator';

import ArrowIcon from 'react-native-vector-icons/Ionicons'
import DotIcon from 'react-native-vector-icons/Entypo'
import RupeeIcon from 'react-native-vector-icons/FontAwesome'
import NavigationService from '../../../../../NavigationService';

const customStyles = {
  stepIndicatorSize: 8,
  currentStepIndicatorSize: 8,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 2,
  stepStrokeWidth: 2,
  stepStrokeCurrentColor: '#054752',
  stepStrokeFinishedColor: '#054752',
  stepStrokeUnFinishedColor: '#054752',
  separatorFinishedColor: '#054752',
  separatorUnFinishedColor: '#054752',
  stepIndicatorFinishedColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: '#054752',
  stepIndicatorLabelFinishedColor: '#054752',
  stepIndicatorLabelUnFinishedColor: '#054752',
  labelColor: '#054752',
  labelSize: 16,
  currentStepLabelColor: '#054752',
  labelAlign: 'center'
}


export default class SearchList extends Component {

  constructor(props){
    super(props)
    this.state = {
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
      rides: [],
      preferences: [],
      currentPosition: 0,

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
  
      await axios.post(`/rides/search_ride`, searchedRide,
      ).then(res => {
        const resData = res.data
        if(resData && resData.response && resData.response.rides && (resData.response.rides).length > 0){
          this.setState({
            rides: res.data.response.rides,
            ridesListVisible: true
          });
          console.log("ridelistVisible ", this.state.ridesListVisible)
        }
        else{
          this.setState({
            bookedRideVisible: false
          })
        }
        console.log(res.data.response.rides)
        
      }).catch(err => {
        console.log('error sending search request : ', err)
      })
    }

    gettingSearchedRideData()   
  }

  async saveUserRideInfo(item){
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
    await AsyncStorage.setItem('booked_user', JSON.stringify(item.booked_user))
    this.props.navigation.navigate('UserAndRideInfo')
  }

  renderRide = ({item}) => {
    if(item.offered_ride_passengers_no != 0){
      return(
        <TouchableOpacity style = {styles.rideItemView} onPress = {() => {this.saveUserRideInfo(item)}}>
            <View style = {{marginTop: 20, marginLeft: 5, justifyContent: 'space-between',}}>
               <StepIndicator
                  customStyles={customStyles}
                  direction='vertical'
                  stepCount={2}
                  currentPosition={this.state.currentPosition}
                  labels={[item.pick_up_name, item.drop_off_name]}
              />
          </View>

          <View style = {{flexDirection: "row", marginTop: 20, justifyContent: 'space-between' }} >
            <View style = {{flexDirection: "row", }}>
              <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
              <Text style = {{
                fontSize: 16,
                marginTop: 10,
                marginLeft: 5,
                fontWeight: 'bold',
                color: '#054752',
                }}>{item.offered_user.name}</Text>
            </View>

            <View style = {{flexDirection: "row", padding: 10 }}>
              <RupeeIcon name = 'rupee' size = {14} color = '#054752' style = {{marginTop: 7}} />
              <Text style = {{
                marginLeft: 2,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#054752',
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
          <ArrowIcon name = 'md-arrow-forward' size = {20} color = '#054752' style = {{marginRight: 10}}>
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

        {this.state.ridesListVisible && 
        <FlatList
          data={this.state.rides}
          renderItem={this.renderRide}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle = {{marginVertical: 30, paddingBottom: 20}}
          keyExtractor={(ride) => { return ride._id; }}
        /> }

        {!this.state.ridesListVisible &&
        <View>
          <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/person_searching.png')}/>
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
    fontSize: 14,
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
    color: '#054752',
    // fontFamily: 'sans-serif-medium',
  },

  offerLocationText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#054752',
    // fontFamily: 'Roboto-Medium',
  },

  location: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#054752',
    flexWrap: 'wrap',
},
  
  })
    
