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
import config from '../../../../config/constants'

const locationIcon = (<Icon name = "my-location" size = {20} color = "#666666" style = {{marginTop: 8,}}/>)

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
  ToastAndroid,
} from 'react-native'

import _ from 'lodash';


export default class Search extends Component {

  constructor(props)
  {
    super(props)
    this._handleBackHandler = this._handleBackHandler.bind(this);

    this.state = {
      isLoading: false,

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

      isleavingFromFocused: false,
      isGoingToFocused: false,

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
    StatusBar.setBackgroundColor(config.COLOR);
  });

  BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);


  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.setState({
        currentLocationLatitude: position.coords.latitude,
        currentLocationLongitude: position.coords.longitude
      })
    },
    (error) => {
      console.log('error getting current location', error)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    },
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
  if(leavingFromJson.error_message){
    ToastAndroid.show('Unable to get selected location. Try again', ToastAndroid.SHORT);
    this.setState({
      showDateTimePickerAfterLeavingFrom: false,
      showSearchAfterLeavingFrom: false
    })
  }
  this.setState({
    leavingFromPredictions: leavingFromJson.predictions,
  });
  }catch(err) {
    this.setState({
      showDateTimePickerAfterLeavingFrom: false,
      showSearchAfterLeavingFrom: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
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
    if(goingToJson.error_message){
      ToastAndroid.show('Unable to get selected location. Try again', ToastAndroid.SHORT)
      this.setState({
        showDateTimePickerAfterGoingTo: false,
        showSearchAfterGoingTo: false
      })
    }
    this.setState({
      goingToPredictions: goingToJson.predictions
    });
  }catch(err) {
    this.setState({
      showDateTimePickerAfterGoingTo: false,
      showSearchAfterGoingTo: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    console.log(err)
  }
}


async getCurrentLocationForLeavingFrom() {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLocationLatitude},${this.state.currentLocationLongitude}&key=${apiKey}&location_type=ROOFTOP`;

  try{
    const result = await fetch(apiUrl);
    const currentLocationJson = await result.json();
    console.log('currentLocationJson', currentLocationJson)
    if(currentLocationJson.error_message){
      ToastAndroid.show('Unable to get your current location. Try again', ToastAndroid.SHORT);
      this.setState({
        showDateTimePickerAfterLeavingFrom: false,
        showSearchAfterLeavingFrom: false
      })
    }
    this.setState({
      currentLocationPredictions: currentLocationJson.results,
    });

    this.state.currentLocationPredictions.map(currentLocationPrediction => (
      key = currentLocationPrediction.id,
      this.setCurrentLocationToLeavingFrom(currentLocationPrediction.formatted_address)
    ))
  }catch(err) {
    this.setState({
      showDateTimePickerAfterLeavingFrom: false,
      showSearchAfterLeavingFrom: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    console.log(err)
 }
}

setCurrentLocationToLeavingFrom =(currentPlace) => {
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
    if(currentLocationJson.error_message){
      ToastAndroid.show('Unable to get your current location. Try again', ToastAndroid.SHORT);
      this.setState({
        showDateTimePickerAfterGoingTo: false,
        showSearchAfterGoingTo: false
      })
    }
    this.setState({
      currentLocationPredictions: currentLocationJson.results,
    });

    this.state.currentLocationPredictions.map(currentLocationPrediction => (
      key = currentLocationPrediction.id,
      this.setCurrentLocationToGoingTo(currentLocationPrediction.formatted_address)
    ))
  }catch(err) {
    this.setState({
      showDateTimePickerAfterGoingTo: false,
      showSearchAfterGoingTo: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    console.log(err)
 }

}

setCurrentLocationToGoingTo =(currentPlace) => {
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
  const placeIdApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${leavingPlace.place_id}&key=${apiKey}`

  try {
    const placeIdResult = await fetch(placeIdApiUrl);
    const placeIdJson = await placeIdResult.json();
    if(placeIdJson.error_message){
      ToastAndroid.show('Unable to set your selected location. Try again', ToastAndroid.SHORT);
      this.setState({
        showDateTimePickerAfterLeavingFrom: false,
        showSearchAfterLeavingFrom: false
      })
    }
    else {
      this.setState({
        leavingFromLatitude: placeIdJson.result.geometry.location.lat,
        leavingFromLongitude: placeIdJson.result.geometry.location.lng
      }) 
    }  
  } catch (error) {
    this.setState({
      showDateTimePickerAfterLeavingFrom: false,
      showSearchAfterLeavingFrom: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    console.log(error)  
  }
}

async setGoingToLocation (goingPlace) {
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
    if(placeIdJson.error_message){
      ToastAndroid.show('Unable to set your selected location. Try again', ToastAndroid.SHORT);
      this.setState({
        showDateTimePickerAfterGoingTo: false,
        showSearchAfterGoingTo: false
      })
    }
    else {
      this.setState({
        goingToLatitude: placeIdJson.result.geometry.location.lat,
        goingToLongitude: placeIdJson.result.geometry.location.lng
      }) 
    } 
  } catch (error) {
    this.setState({
      showDateTimePickerAfterGoingTo: false,
      showSearchAfterGoingTo: false
    })
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
      console.log(error)  
  }
}



setleavingFromLoading = () => {
  this.setState({
    leavingFromLoading: true,
    goingToLoading: false,

    currentPlaceLoadingForLeavingFrom: true,
    currentPlaceLoadingForGoingTo: false,
    isleavingFromFocused: true  ,

    showDateTimePickerAfterLeavingFrom: false,
    showSearchAfterLeavingFrom: false
  })
}

setGoingToLoading = () => {
  this.setState({
    goingToLoading: true,
    leavingFromLoading: false,

    currentPlaceLoadingForLeavingFrom: false,
    currentPlaceLoadingForGoingTo: true,
    isGoingToFocused: true,

    showSearchAfterGoingTo: false,
    showDateTimePickerAfterGoingTo: false
  })
}

handleLeavingFromBlur = () => {
  if(this.state.leavingFrom != ''){
    this.setState({
      isleavingFromFocused: false,
      showDateTimePickerAfterLeavingFrom: true,
      showSearchAfterLeavingFrom: true})
    }
  }
handleGoingToBlur = () => {
  if(this.state.goingTo != ''){
    this.setState({
      isGoingToFocused: false,
      showDateTimePickerAfterGoingTo: true,
      showSearchAfterGoingTo: true})
    }
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
  this.setState({
    isLoading: true
  })
  try {
    await AsyncStorage.setItem('leave_from_location', JSON.stringify(this.state.leavingFrom))
    await AsyncStorage.setItem('going_to_location', JSON.stringify(this.state.goingTo))
    await AsyncStorage.setItem('leave_from_longitude', JSON.stringify(this.state.leavingFromLongitude))
    await AsyncStorage.setItem('leave_from_latitude', JSON.stringify(this.state.leavingFromLatitude))
    await AsyncStorage.setItem('going_to_longitude', JSON.stringify(this.state.goingToLongitude))
    await AsyncStorage.setItem('going_to_latitude', JSON.stringify(this.state.goingToLatitude))
    await AsyncStorage.setItem('searched_ride_date_time', JSON.stringify(this.state.pickedDate))
    this.props.navigation.navigate('SearchList')
    this.setState({
      isLoading: false
    })
  } catch (error) {
    console.log('error in async storage ', error)
    ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
    this.setState({
      isLoading: false
    })
  }
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
      <SafeAreaView style={[ { backgroundColor: config.COLOR }]}/>
        <Text style = {styles.findRide}>Find a ride</Text>

        <TextInput 
          placeholder='Leaving from'
          placeholderTextColor={'#737373'}
          selectionColor={config.COLOR}
          value={this.state.leavingFrom}
          onFocus = {this.setleavingFromLoading}
          onBlur={this.handleLeavingFromBlur}
          style={[styles.textInput, 
            {borderBottomColor: (this.state.isleavingFromFocused? config.COLOR: '#000'),
            borderBottomWidth: this.state.isleavingFromFocused? 2: 1,}]}
          onChangeText={leavingFrom =>{
            this.setState({ leavingFrom });
            this.onChangeLeavingFromDebounced(leavingFrom)}}/>

        <TextInput 
          placeholder='Going To'
          placeholderTextColor={'#737373'}
          selectionColor={config.COLOR}
          value={this.state.goingTo}
          onFocus = {this.setGoingToLoading}
          onBlur={this.handleGoingToBlur}
          style={[styles.textInput, 
            {borderBottomColor: (this.state.isGoingToFocused? config.COLOR: '#000'),
            borderBottomWidth: this.state.isGoingToFocused? 2: 1,}]}
          onChangeText={goingTo =>{
            this.setState({ goingTo });
            this.onChangegoingToDebounced(goingTo)}}/>

        {/* <View style = {{
          borderBottomWidth: 1.5,
          borderBottomColor: config.TEXT_COLOR,
          marginHorizontal: 20,
          marginTop: 30,}}/> */}



    {this.state.currentPlaceLoadingForLeavingFrom &&
      <View style = {{
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: config.TEXT_COLOR,
        marginHorizontal: 20,}}>
          {locationIcon}<Text
          style = {{
          paddingVertical: 10,
          fontSize: 16,
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          color: '#666666', 
          }}
          onPress = {() => this.getCurrentLocationForLeavingFrom()}
        >   Use current location</Text></View>}

    {this.state.currentPlaceLoadingForGoingTo &&
      <View style = {{
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: config.TEXT_COLOR,
        marginHorizontal: 20,}}>
          {locationIcon}<Text
          style = {{
          paddingVertical: 10,
          fontSize: 16,
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          color: config.TEXT_COLOR,
          }}
          onPress = {() => this.getCurrentLocationForGoingTo()}
        >   Use current location</Text></View>}

        {this.state.leavingFromLoading && leavingFromPredictions}
        {this.state.goingToLoading && goingToPredictions}

        {/* {this.state.showDateTimePickerAfterLeavingFrom && this.state.showDateTimePickerAfterGoingTo && */}
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
                color: config.COLOR,
                fontWeight: 'bold',
                marginTop: 5,
                fontSize: 17,
                fontFamily: "sans-serif-medium",
                  }}>{this.state.daysNames[this.state.pickedDate.getDay()]}, {this.state.pickedDate.getDate()} {this.state.monthNames[this.state.pickedDate.getMonth()]}, {this.state.hours}:{this.state.minutes}
            </Text>        

            <Icon2 name = "ios-arrow-down" 
              size = {20} color = {config.COLOR}
              style = {{ position: 'absolute',
                right: 10,
                top: 20}}/>        
          </TouchableOpacity>
        {/*  } */}

        <DateTimePicker
          mode = 'datetime'
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />

        {/* {this.state.showSearchAfterLeavingFrom && this.state.showSearchAfterGoingTo && */}
        <View style={{alignItems: 'center',marginTop: 50}}>
          <Button mode = "contained" style = {styles.searchRide}
            onPress = {() => {this.searchLeavingFromAndGoingToLocation()}}
            loading = {this.state.isLoading}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }}
            >Search</Text>
          </Button>
        </View>
        {/* } */}
    
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
    color: config.TEXT_COLOR,
    margin: 20,
  },

  textInput: {
    paddingVertical: 0,
    fontWeight: 'bold',
    color: config.TEXT_COLOR,
    height: 40,
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
  },

  suggestions: {
    backgroundColor: "#fff",
    padding: 5,
    fontSize: 16,
    borderBottomWidth: 0.5,
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: config.TEXT_COLOR,
  },

  searchRide: {
    borderRadius: 30,
    width: 280,
    height: 45,
    backgroundColor: config.COLOR,
    justifyContent: 'center',
  },

  showTimePicker: {
    alignItems: 'flex-start' ,
    borderColor: '#000',
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    marginHorizontal: 20
    // height: 50,

  },


})



