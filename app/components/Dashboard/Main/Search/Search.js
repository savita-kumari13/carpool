import React, { Component } from 'react'
import
{
  NavigationActions ,
  createStackNavigator,
  createAppContainer
} from 'react-navigation'

import DateTimePicker from 'react-native-modal-datetime-picker';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage'
import apiKey from '../../../apiKey'


const locationIcon = (<Icon name = "my-location" size = {20} color = "grey" style = {{marginRight: 20}}/>)

import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'

import _ from 'lodash';


export default class Search extends Component {

  constructor(props)
  {
    super(props)
    this._handleBackHandler = this._handleBackHandler.bind(this);

    this.state = {
      leavingFrom: '',
      goingTo: '',

      leavingFromPlaceId: '',
      goingToPlaceId: '',

      leavingFromLongitude: 0,
      leavingFromLatitude: 0,

      goingToLatitude: 0,
      goingToLongitude: 0,

      currentLocationLatitude: 0,
      currentLocationLongitude: 0,

      error: '',

      leavingFromPredictions: [],
      goingToPredictions: [],
      currentLocationPredictions: [],

      leavingFromloading: false,
      goingToLoading: false,
      currentPlaceLoadingForLeavingFrom: false,
      currentPlaceLoadingForGoingTo: false,


      showDateTimePickerAfterLeavingFrom: false,
      showDateTimePickerAfterGoingTo: false,

      showSearchAfterLeavingFrom: false,
      showSearchAfterGoingTo: false,

      pickedDate: new Date(),
      isDateTimePickerVisible: false,
      hours : new Date().getHours(),
      minutes : new Date().getMinutes(),


      monthNames : ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ],

      daysNames : ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            ],        
      
    };
    this.onChangeLeavingFromDebounced = _.debounce(this.onChangeLeavingFrom, 1000)
    this.onChangegoingToDebounced = _.debounce(this.onChangeGoingTo, 1000)
  }


componentDidMount()
{

  this.setState({
    hours: (this.state.hours <10?'0':'') + this.state.hours,
    minutes: (this.state.minutes <10?'0':'') + this.state.minutes
    
})  

  this._navListener = this.props.navigation.addListener('didFocus', () => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#7963b6');
  });

  BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);


  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.setState({
        currentLocationLatitude: position.coords.latitude,
        currentLocationLongitude: position.coords.longitude
      })
      console.log('position', position)
      console.log('currentLocationLatitude', this.state.currentLocationLatitude)
      console.log('currentLocationLongitude', this.state.currentLocationLongitude)
    },
    error => console.log('error getting current location', error),
    { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
  );

}

componentWillUnmount()
{

  this._navListener.remove();
  BackHandler.removeEventListener('hardwareBackPress', this._handleBackHandler);
}

_handleBackHandler = () => {
  this.props.navigation.dispatch(NavigationActions.back())
   return true;
 }

async onChangeLeavingFrom(leavingFrom) {
  this.setState(
    {
    leavingFrom,
  })
  const leaveApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${leavingFrom}&radius=2000`;
    
  try{
  const leaveResult = await fetch(leaveApiUrl);
  const leavingFromJson = await leaveResult.json();
  console.log('leavingFromJson', leavingFromJson)

  this.setState({
    leavingFromPredictions: leavingFromJson.predictions,
  });
  }catch(err) {
    console.log(err)
  }

}

async onChangeGoingTo(goingTo) {
  this.setState(
    {
      goingTo,
    })
  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${goingTo}&radius=2000`;

  try{
    const result = await fetch(apiUrl);
    const goingToJson = await result.json();
    console.log('goinToJson', goingToJson)
    this.setState({
      goingToPredictions: goingToJson.predictions
    });
  }catch(err) {
    console.log(err)
  }
}


async getCurrentLocationForLeavingFrom() {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLocationLatitude},${this.state.currentLocationLongitude}&key=${apiKey}&location_type=ROOFTOP`;

  try{
    const result = await fetch(apiUrl);
    const currentLocationJson = await result.json();
    console.log('currentLocationJson', currentLocationJson)
    this.setState({
      currentLocationPredictions: currentLocationJson.results,
    });

    this.state.currentLocationPredictions.map(currentLocationPrediction => (
      key = currentLocationPrediction.id,
      this.setCurrentLocationToLeavingFrom(currentLocationPrediction.formatted_address)
    ))
  }catch(err) {
   console.log(err)
 }
}

setCurrentLocationToLeavingFrom =(currentPlace) => {
  console.log('currentPlaceForLeavingPlace', currentPlace)
  this.setState({
    leavingFrom: currentPlace,
    leavingFromLatitude: this.state.currentLocationLatitude,
    leavingFromLongitude: this.state.currentLocationLongitude,
    leavingFromLoading: false,
    goingToLoading: false,
    currentPlaceLoadingForLeavingFrom: false,
    currentPlaceLoadingForGoingTo: false,
    showDateTimePickerAfterLeavingFrom: true,
    showSearchAfterLeavingFrom: true
  })
}

async getCurrentLocationForGoingTo() {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLocationLatitude},${this.state.currentLocationLongitude}&key=${apiKey}&location_type=ROOFTOP`;

  try{
    const result = await fetch(apiUrl);
    const currentLocationJson = await result.json();
    console.log('currentLocationJson', currentLocationJson)
    this.setState({
      currentLocationPredictions: currentLocationJson.results,
    });

    this.state.currentLocationPredictions.map(currentLocationPrediction => (
      key = currentLocationPrediction.id,
      this.setCurrentLocationToGoingTo(currentLocationPrediction.formatted_address)
    ))
  }catch(err) {
   console.log(err)
 }

}

setCurrentLocationToGoingTo =(currentPlace) => {
  console.log('currentPlaceForGoingPlace', currentPlace)
  this.setState({
    goingTo: currentPlace,
    goingToLatitude: this.state.currentLocationLatitude,
    goingToLongitude: this.state.currentLocationLongitude,
    leavingFromLoading: false,
    goingToLoading: false,
    currentPlaceLoadingForLeavingFrom: false,
    currentPlaceLoadingForGoingTo: false,
    showDateTimePickerAfterGoingTo: true,
    showSearchAfterGoingTo: true,
  })
}

async setLeaveLocation (leavingPlace) {
  console.log('selected leaving place : ', leavingPlace)
  console.log('selected leaving place_id : ', leavingPlace.place_id)
  this.setState({
    leavingFromPlaceId: leavingPlace.place_id,
    leavingFrom: leavingPlace.description,
    leavingFromLoading: false,
    goingToLoading: false,
    currentPlaceLoadingForLeavingFrom: false,
    currentPlaceLoadingForGoingTo: false,
    showDateTimePickerAfterLeavingFrom: true,
    showSearchAfterLeavingFrom: true,
  })

  console.log('leaving place id : ', this.state.leavingFromPlaceId)

  const placeIdApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${leavingPlace.place_id}&key=${apiKey}`

  try {
    const placeIdResult = await fetch(placeIdApiUrl);
    const placeIdJson = await placeIdResult.json();
    console.log('place id json : ', placeIdJson)

    this.setState({
      leavingFromLatitude: placeIdJson.result.geometry.location.lat,
      leavingFromLongitude: placeIdJson.result.geometry.location.lng
    })
      
  } catch (error) {
      console.log(error)  
  }
}

async setGoingToLocation (goingPlace) {

  console.log('selected going place : ', goingPlace)
  console.log('selected going place_id : ', goingPlace.place_id)
  this.setState({
    goingToPlaceId: goingPlace.place_id,
    goingTo: goingPlace.description,

    leavingFromLoading: false,
    goingToLoading: false,

    currentPlaceLoadingForLeavingFrom: false,
    currentPlaceLoadingForGoingTo: false,

    showDateTimePickerAfterGoingTo: true,
    showSearchAfterGoingTo: true,
  })

  const placeIdApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${goingPlace.place_id}&key=${apiKey}`

  try {
    const placeIdResult = await fetch(placeIdApiUrl);
    const placeIdJson = await placeIdResult.json();
    console.log('place id json : ', placeIdJson)

    this.setState({
      goingToLatitude: placeIdJson.result.geometry.location.lat,
      goingToLongitude: placeIdJson.result.geometry.location.lng
    })  
  } catch (error) {
      console.log(error)  
  }
}



setleavingFromLoading = () => {
  this.setState({
    leavingFromLoading: true,
    goingToLoading: false,

    currentPlaceLoadingForLeavingFrom: true,
    currentPlaceLoadingForGoingTo: false,
    // showDateTimePickerAfterLeavingFrom: false,
    // showDateTimePickerAfterGoingTo: false
  })
}

setGoingToLoading = () => {
  this.setState({
    goingToLoading: true,
    leavingFromLoading: false,

    currentPlaceLoadingForLeavingFrom: false,
    currentPlaceLoadingForGoingTo: true,
    // showDateTimePickerAfterLeavingFrom: false,
    // showDateTimePickerAfterGoingTo: false
  })
}

_showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
_hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

_handleDatePicked = (date) => {
  this.setState({
      pickedDate: date ,
      hours: ((date.getHours()) < 10? '0': '') + date.getHours(),
      minutes: ((date.getMinutes()) < 10? '0': '') + date.getMinutes()
  })

  this._hideDateTimePicker();
};

async searchLeavingFromAndGoingToLocation()
{
  console.log('picked date time : ', this.state.pickedDate)
  await AsyncStorage.setItem('leave_from_longitude', JSON.stringify(this.state.leavingFromLongitude))
  await AsyncStorage.setItem('leave_from_latitude', JSON.stringify(this.state.leavingFromLatitude))
  await AsyncStorage.setItem('going_to_longitude', JSON.stringify(this.state.goingToLongitude))
  await AsyncStorage.setItem('going_to_latitude', JSON.stringify(this.state.goingToLatitude))
  await AsyncStorage.setItem('searched_ride_date_time', JSON.stringify(this.state.pickedDate))
  this.props.navigation.navigate('SearchList')
}




render() {

  const  leavingFromPredictions = this.state.leavingFromPredictions.map(leavingFromPrediction => (    
    <Text
      style = {styles.suggestions}
      key = {leavingFromPrediction.id}
      onPress = {() => this.setLeaveLocation(leavingFromPrediction)}>{leavingFromPrediction.description}</Text>))

  const  goingToPredictions = this.state.goingToPredictions.map(goingToPrediction => (
    <Text
      style = {styles.suggestions}
      key = {goingToPrediction.id}
      onPress = {() => this.setGoingToLocation(goingToPrediction)}>{goingToPrediction.description}</Text>))


  return (
    <ScrollView contentContainerStyle = {styles.container}>
      <SafeAreaView style={[ { backgroundColor: '#7963b6' }]}/>
        <Text style = {styles.findRide}>Find a ride</Text>

        <TextInput
          placeholder='Leaving from'
          value={this.state.leavingFrom}
          style = {styles.textInput}
          onChangeText={leavingFrom =>{
            this.setState({ leavingFrom });
            this.onChangeLeavingFromDebounced(leavingFrom)}}
            onFocus = {this.setleavingFromLoading}  
        />
        
        <TextInput
          placeholder='Going To'
          value={this.state.goingTo}
          style = {styles.textInput}
          onChangeText={goingTo =>{
            this.setState({ goingTo });
            this.onChangegoingToDebounced(goingTo)}}
            onFocus = {this.setGoingToLoading} 
        />

        <View
        style = {{borderBottomColor:'#054752', borderBottomWidth: 1, margin: 10}}/>

        {this.state.currentPlaceLoadingForLeavingFrom && <Text
          style = {{backgroundColor: "#fff",
                    padding: 10,
                    fontSize: 16,
                    borderBottomWidth: 0.5,
                    marginLeft: 10,
                    }}
          onPress = {() => this.getCurrentLocationForLeavingFrom()}
        >{locationIcon}Use current location</Text>}

        {this.state.currentPlaceLoadingForGoingTo && <View><Text
          style = {{backgroundColor: "#fff",
          padding: 10,
          fontSize: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 0.5,
          marginLeft: 10,}}
          onPress = {() => this.getCurrentLocationForGoingTo()}
        >{locationIcon}Use current location</Text></View>}

        {this.state.leavingFromLoading && leavingFromPredictions}
        {this.state.goingToLoading && goingToPredictions}

        {this.state.showDateTimePickerAfterLeavingFrom && this.state.showDateTimePickerAfterGoingTo &&
          <TouchableOpacity style = {styles.showTimePicker}
            onPress={this._showDateTimePicker}>
            <Text 
              style = {{
                color: '#737373',
                fontWeight: 'bold',
                fontSize: 17,
                fontFamily: "sans-serif-medium",
                }}>Date & Time
            </Text>

            <Text 
              style = {{
                color: '#7963b6',
                fontWeight: 'bold',
                marginTop: 5,
                fontSize: 17,
                fontFamily: "sans-serif-medium",
                  }}>{this.state.daysNames[this.state.pickedDate.getDay()]}, {this.state.pickedDate.getDate()} {this.state.monthNames[this.state.pickedDate.getMonth()]}, {this.state.hours}:{this.state.minutes}
            </Text>        

            <Icon2 name = "ios-arrow-down" 
              size = {20} color = "#7963b6"
              style = {{ position: 'absolute',
                          right: 30,
                          top: 20}}
                                        />        
          </TouchableOpacity>
        }

        <DateTimePicker
          mode = 'datetime'
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />

        {this.state.showSearchAfterLeavingFrom && this.state.showSearchAfterGoingTo &&
          <Button mode = "contained" style = {styles.searchRide}
            onPress = {() => {this.searchLeavingFromAndGoingToLocation()}}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }}
            >Search</Text>
          </Button>}
    
    </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },

  findRide: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    fontSize: 30,
    color: '#054752',
    margin: 20,
  },
  textInput: {
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#f2f2f2',
    height: 50,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  suggestions: {
    backgroundColor: "#fff",
    padding: 5,
    fontSize: 16,
    borderBottomWidth: 0.5,
    marginHorizontal: 10,
    
  },

  searchRide: {
    borderRadius: 30,
        width: 100,
        height: 40,
        backgroundColor: "#7963b6",
        justifyContent: 'center',
        position: 'absolute',
        bottom: '35%',
        left: '35%',
  },

  showTimePicker: {
    alignItems: 'flex-start' ,
    borderColor: '#000',
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 0.5,
    // height: 50,

  },


})



