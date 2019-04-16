import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import Icon from 'react-native-vector-icons/EvilIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'

export default class SearchList extends Component {

  constructor(props){
    super(props)
    this.route = "http://192.168.137.1:5570"
  }

  componentDidMount = () => {
    gettingSearchedRideData = async() =>{
      const token = await AsyncStorage.getItem('id_token') 
      const authToken = token.replace(/^"(.*)"$/, '$1');
      console.log('token to send as authorizaton header : ', authToken)

      const leavingFromLongitudeToParse = await AsyncStorage.getItem('leave_from_longitude')
      const leavingFromLatitudeToParse = await AsyncStorage.getItem('leave_from_latitude')
      const goingToLongitudeToParse = await AsyncStorage.getItem('going_to_longitude')
      const goingToLatitudeToParse = await AsyncStorage.getItem('going_to_latitude')
      const pickedDateToParse = await AsyncStorage.getItem('searched_ride_date_time')

      const leavingFromLongitude = JSON.parse(leavingFromLongitudeToParse)
      const leavingFromLatitude = JSON.parse(leavingFromLatitudeToParse)
      const goingToLongitude = JSON.parse(goingToLongitudeToParse)
      const goingToLatitude = JSON.parse(goingToLatitudeToParse)
      const pickedDate = JSON.parse(pickedDateToParse)

      const searchedRide = {
        leaving_from_coordinates: [leavingFromLongitude, leavingFromLatitude],
        going_to_coordinates: [goingToLongitude, goingToLatitude],
        searched_ride_date_time: pickedDate
  
      }
  
      await axios.post(`${this.route}/rides/search_ride`, searchedRide,
      { headers: {Authorization: `Bearer ${authToken}`}}
      ).then(res => {
        console.log('res received : ', res)
      }).catch(err => {
        console.log('error sending search request : ', err)
      })
    }

    gettingSearchedRideData()
    
  }


   
  render() {
    return (
      <View>
      </View>
      
  )
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      // alignItems: 'center',
      // justifyContent: 'center',
      paddingTop: 30,    
    },
  
  })
    
