import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ListView,
    FlatList,
    ScrollView
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../../../axios'
import ArrowIcon from 'react-native-vector-icons/Ionicons'
import LineIcon from 'react-native-vector-icons/Entypo'

export default class SearchList extends Component {

  constructor(props){
    super(props)
    this.state = {
      leaveLocation: '',
      goingLocation: '',
      dateTime: '',
      rides: []
    }
  }

  componentDidMount() {
    gettingSearchedRideData = async() =>{
      const token = await AsyncStorage.getItem('id_token') 
      const authToken = token.replace(/^"(.*)"$/, '$1');
      console.log('token to send as authorizaton header : ', authToken)
  
      const leavingFromLocationToParse = await AsyncStorage.getItem('leave_from_location')
      const goingToLocationToParse = await AsyncStorage.getItem('going_to_location')
      const leavingFromLongitudeToParse = await AsyncStorage.getItem('leave_from_longitude')
      const leavingFromLatitudeToParse = await AsyncStorage.getItem('leave_from_latitude')
      const goingToLongitudeToParse = await AsyncStorage.getItem('going_to_longitude')
      const goingToLatitudeToParse = await AsyncStorage.getItem('going_to_latitude')
      const pickedDateToParse = await AsyncStorage.getItem('searched_ride_date_time')
  
      const leavingFromLocation = JSON.parse(leavingFromLocationToParse)
      const goingToLocation = JSON.parse(goingToLocationToParse)
      console.log('leave : ', leavingFromLocation)
      console.log('going : ', goingToLocation)
      const leavingFromLongitude = JSON.parse(leavingFromLongitudeToParse)
      const leavingFromLatitude = JSON.parse(leavingFromLatitudeToParse)
      const goingToLongitude = JSON.parse(goingToLongitudeToParse)
      const goingToLatitude = JSON.parse(goingToLatitudeToParse)
      const pickedDateString = JSON.parse(pickedDateToParse)
      const pickedDate = new Date(pickedDateString)
      const date = pickedDate.toString()
  
      this.setState({
        leaveLocation: leavingFromLocation,
        goingLocation: goingToLocation,
        dateTime: date
      })
  
      const searchedRide = {
        leaving_from_coordinates: [leavingFromLongitude, leavingFromLatitude],
        going_to_coordinates: [goingToLongitude, goingToLatitude],
        searched_ride_date_time: pickedDate
  
      }
  
      await axios.post(`/rides/search_ride`, searchedRide,
      ).then(res => {
        this.setState({
          rides: res.data.response.rides
        });
        console.log(res.data.response.rides)
        
      }).catch(err => {
        console.log('error sending search request : ', err)
        // if(err.response.status === 401){      
        //   Alert.alert(
        //       'Token expired',
        //       'Please login again',
        //       [
        //         {text: 'OK', onPress: () => this.props.navigation.navigate('login')},
        //       ],
        //       {cancelable: false},
        //     );
        //     }
      })
    }

    gettingSearchedRideData()   
  }

  renderRide = ({item}) => {
    return(
        <View style = {{flexDirection: "row", marginBottom: 5, backgroundColor: '#df9fbf'}}>
          <LineIcon name = 'flow-line' size = {20} color = '#054752' style = {{marginHorizontal: 5}}/>
          <View style = {{flexDirection: "column", backgroundColor: '#ffcc99'}}>
            <Text style = {styles.searchLocationText}>{item.pick_up_name}</Text>
            <Text style = {styles.searchLocationText}>{item.drop_off_name}</Text>
          </View>
        </View>
    )

  }

   
  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <View style = {{flexDirection: "row", marginTop: 20,marginBottom: 5, backgroundColor: 'pink',}}>
          <Text style = {styles.searchLocationText}>{this.state.leaveLocation}</Text>
          <ArrowIcon name = 'md-arrow-round-forward' size = {20} color = '#054752' style = {{marginHorizontal: 5}}/>
          <Text style = {styles.searchLocationText}>{this.state.goingLocation}</Text>
        </View>
        <View>
          <Text>{this.dateTime}</Text>
        </View>
        <FlatList
          data={this.state.rides}
          renderItem={this.renderRide}
          keyExtractor={(ride) => { return ride._id; }}
        /> 
      </ScrollView>     
    )
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#b3d9ff'
    },

    searchLocationText: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#054752',
      fontFamily: 'sans-serif-medium',
      flexWrap: 'wrap'
    }
  
  })
    
