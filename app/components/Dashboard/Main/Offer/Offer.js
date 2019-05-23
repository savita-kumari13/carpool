import React, { Component } from 'react'
import { NavigationActions ,} from 'react-navigation'
import firebase from 'react-native-firebase';
import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native'
import {  Button,} from 'react-native-paper';
import config from '../../../../config/constants'
import _ from 'lodash';
import apiKey from '../../../apiKey'
import AsyncStorage from '@react-native-community/async-storage'
import IconLocation from 'react-native-vector-icons/MaterialIcons';
import IconNext from 'react-native-vector-icons/Ionicons'

const locationIcon = (
  <IconLocation name = "my-location" size = {20} color = "grey"
    style = {{marginTop: 8,}}/>)

const nextIcon = (
  <IconNext name = "ios-arrow-dropright-circle" size = {50} color = {config.COLOR}
      style = {{position: 'absolute',
      bottom:20,
      right:20,}}
      />)

export default class Offer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      isLoading: false,

      pickUp: '',
      dropOff: '',

      pickUpPlaceId: '',
      dropOffPlaceId: '',

      pickUpLatitude: 0,
      pickUpLongitude: 0,

      dropOfflatitude: 0,
      dropOfflongitude: 0,

      currentLocationLatitude: 0,
      currentLocationLongitude: 0,

      pickUpPredictions: [],
      dropOffPredictions: [],
      currentLocationPredictions: [],

      pickUploading: false,
      dropOffLoading: false,
      currentPlaceLoadingForPickUp: false,
      currentPlaceLoadingForDropOff: false,

      showNextIconAfterPickUp: false,
      showNextIconAfterDropOff: false,

      isPickUpFocused: false,
      isDropOffFocused: false,
    }

  this._handleBackHandler = this._handleBackHandler.bind(this);

  this.onChangePickUpDebounced = _.debounce(this.onChangePickUp, 1000)
  this.onChangeDropOffDebounced = _.debounce(this.onChangeDropOff, 1000)
}


componentDidMount()
{

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
      this.setState({
      error: error.message
      })
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

 async onChangePickUp(pickUp) {
  this.setState(
    {
     pickUp,
   })
  const pickUpApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${pickUp}&radius=2000`;
  
  try{
   const pickUpResult = await fetch(pickUpApiUrl);
   const pickUpJson = await pickUpResult.json();

   if(pickUpJson.error_message){
    ToastAndroid.show('Unable to get selected location. Try again', ToastAndroid.SHORT)
    this.setState({
      showNextIconAfterPickUp: false
    })
  }
  else {
    this.setState({
      pickUpPredictions: pickUpJson.predictions,
    });
  }
  }catch(err) {
    this.setState({
      showNextIconAfterPickUp: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  }

}

async onChangeDropOff(dropOff) {
  this.setState(
    {
     dropOff,
   })
  const dropOffApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${dropOff}&radius=2000`;
  
  try{
   const dropOffResult = await fetch(dropOffApiUrl);
   const dropOffJson = await dropOffResult.json();
   if(dropOffJson.error_message){
    ToastAndroid.show('Unable to get selected location. Try again', ToastAndroid.SHORT)
    this.setState({
      showNextIconAfterDropOff: false
    })
  }
  else {
    this.setState({
      dropOffPredictions: dropOffJson.predictions
    });
  }
  }catch(err) {
    this.setState({
      showNextIconAfterDropOff: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  }

}

async getCurrentLocationForPickUp() {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLocationLatitude},${this.state.currentLocationLongitude}&key=${apiKey}&location_type=ROOFTOP`;

  try{
    const result = await fetch(apiUrl);
    const currentLocationJson = await result.json();
    if(currentLocationJson.error_message){
      ToastAndroid.show('Unable to get your current location. Try again', ToastAndroid.SHORT)
      this.setState({
        showNextIconAfterPickUp: false
      })
    }
    else{
      this.setState({
        currentLocationPredictions: currentLocationJson.results,
      });
      this.state.currentLocationPredictions.map(currentLocationPrediction => (
        key = currentLocationPrediction.id,
        this.setCurrentLocationToPickUp(currentLocationPrediction.formatted_address)
      ))
    }
  }catch(err) {
    this.setState({
      showNextIconAfterPickUp: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
 }

}

setCurrentLocationToPickUp =(currentPlace) => {
  this.setState({
    pickUp: currentPlace,
    pickUpLatitude: this.state.currentLocationLatitude,
    pickUpLongitude: this.state.currentLocationLongitude,
    pickUploading: false,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: false,
    currentPlaceLoadingForDropOff: false,
    showNextIconAfterPickUp: true,
  })
}


async getCurrentLocationForDropOff() {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLocationLatitude},${this.state.currentLocationLongitude}&key=${apiKey}&location_type=ROOFTOP`;

  try{
    const result = await fetch(apiUrl);
    const currentLocationJson = await result.json();
    if(currentLocationJson.error_message){
      ToastAndroid.show('Unable to get your current location. Try again', ToastAndroid.SHORT)
      this.setState({
        showNextIconAfterDropOff: false
      })
    }
    else{
      this.setState({
        currentLocationPredictions: currentLocationJson.results,
      });
  
      this.state.currentLocationPredictions.map(currentLocationPrediction => (
        key = currentLocationPrediction.id,
        this.setCurrentLocationToDropOff(currentLocationPrediction.formatted_address)
      ))
    }
  }catch(err) {
    this.setState({
      showNextIconAfterDropOff: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
 }

}

setCurrentLocationToDropOff =(currentPlace) => {
  this.setState({
    dropOff: currentPlace,
    dropOfflatitude: this.state.currentLocationLatitude,
    dropOfflongitude: this.state.currentLocationLongitude,
    pickUploading: false,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: false,
    currentPlaceLoadingForDropOff: false,
    showNextIconAfterDropOff: true,
  })
}

async setPickUpLocation (pickUpPlace) {
  const placeIdApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${pickUpPlace.place_id}&key=${apiKey}`

  try {

    const placeIdResult = await fetch(placeIdApiUrl);
    const placeIdJson = await placeIdResult.json();
    if(placeIdJson.error_message){
      ToastAndroid.show('Unable to set your selected location. Try again', ToastAndroid.SHORT);
      this.setState({
        showNextIconAfterPickUp: false
      })
    }
    else{
      this.setState({
        pickUpPlaceId: pickUpPlace.place_id,
        pickUp: pickUpPlace.description,
        pickUploading: false,
        dropOffLoading: false,
        currentPlaceLoadingForPickUp: false,
        showNextIconAfterPickUp: true,
        pickUpLatitude: placeIdJson.result.geometry.location.lat,
        pickUpLongitude: placeIdJson.result.geometry.location.lng
      }) 
    }
  } catch (error) {
    this.setState({
      showNextIconAfterPickUp: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  }
}

async setDropOffLocation (dropOffPlace) {
  const placeIdApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${dropOffPlace.place_id}&key=${apiKey}`

  try {
    const placeIdResult = await fetch(placeIdApiUrl);
    const placeIdJson = await placeIdResult.json();
    if(placeIdJson.error_message){
      ToastAndroid.show('Unable to set your selected location. Try again', ToastAndroid.SHORT);
      this.setState({
        showNextIconAfterDropOff: false
      })
    }
    else{
      this.setState({
        dropOffPlaceId: dropOffPlace.place_id,
        dropOff: dropOffPlace.description,
        pickUploading: false,
        dropOffLoading: false,
        currentPlaceLoadingForPickUp: false,
        currentPlaceLoadingForDropOff: false,
        showNextIconAfterDropOff: true,
        dropOfflatitude: placeIdJson.result.geometry.location.lat,
        dropOfflongitude: placeIdJson.result.geometry.location.lng
      })
    }
  }catch (error) {
    this.setState({
      showNextIconAfterDropOff: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  }
}

setPickUpLoading = () => {
  this.setState({
    pickUploading: true,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: true,
    currentPlaceLoadingForDropOff: false,

    isPickUpFocused: true,
    showNextIconAfterPickUp: false
  })
}

setDropOffLoading = () => {
  this.setState({
    dropOffLoading: true,
    pickUploading: false,
    currentPlaceLoadingForPickUp: false,
    currentPlaceLoadingForDropOff: true,

    isDropOffFocused: true,
    showNextIconAfterDropOff: false
  })
}

async savePickUpDropOffLocations() {
  this.setState({
    isLoading: true
  })
  try{
    if(this.state.pickUp != this.state.dropOff)
    {
      await AsyncStorage.setItem('pickup_location_latitude', JSON.stringify(this.state.pickUpLatitude))
      await AsyncStorage.setItem('pickup_location_longitude', JSON.stringify(this.state.pickUpLongitude))

      await AsyncStorage.setItem('dropoff_location_latitude', JSON.stringify(this.state.dropOfflatitude))
      await AsyncStorage.setItem('dropoff_location_longitude', JSON.stringify(this.state.dropOfflongitude))

      await AsyncStorage.setItem('pickup_location_name', this.state.pickUp)
      await AsyncStorage.setItem('dropoff_location_name', this.state.dropOff)
      
      this.props.navigation.navigate('DrivingCar')
      this.setState({
        isLoading: false
      })
    }
    else{
      this.setState({
        isLoading: false
      })
      ToastAndroid.show('Please fill different places', ToastAndroid.SHORT)
    }

  }catch(error){
    this.setState({
      isLoading: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  }
  
}

handlePickUpBlur = () => {
  this.setState({
    isPickUpFocused: false,
    // showNextIconAfterPickUp: true,
  })
}
handleDropoffBlur = () => {
  this.setState({
    isDropOffFocused: false,
    // showNextIconAfterDropOff: true,
  })
}


  render() {
    const  pickUpPredictions = this.state.pickUpPredictions.map(pickUpPrediction => (   
      <Text
        style = {styles.suggestions}
        key = {pickUpPrediction.id}
        onPress = {() => this.setPickUpLocation(pickUpPrediction)}>{pickUpPrediction.description}</Text>))

    const  dropOffPredictions = this.state.dropOffPredictions.map(dropOffPrediction => (
      <Text
        style = {styles.suggestions}
        key = {dropOffPrediction.id}
        onPress = {() => this.setDropOffLocation(dropOffPrediction)}>{dropOffPrediction.description}</Text>))


  return (
    <ScrollView contentContainerStyle = {styles.container}>
      <SafeAreaView style={[{ backgroundColor: config.COLOR }]}/>

      <Text style = {styles.findRide}>Offer a ride</Text>

      <TextInput 
        placeholder='Pick-up'
        placeholderTextColor={'#737373'}
        selectionColor={config.COLOR}
        value={this.state.pickUp}
        onFocus = {this.setPickUpLoading}
        onBlur={this.handlePickUpBlur}
        style={[styles.textInput, 
          {borderBottomColor: (this.state.isPickUpFocused? config.COLOR: '#000'),
          borderBottomWidth: this.state.isPickUpFocused? 2: 1,}]}
        onChangeText={pickUp =>{
          this.setState({ pickUp });
          this.onChangePickUpDebounced(pickUp)}}/>
            
      <TextInput 
        placeholder='Drop-off'
        placeholderTextColor={'#737373'}
        selectionColor={config.COLOR}
        value={this.state.dropOff}
        onFocus = {this.setDropOffLoading}
        onBlur={this.handleDropoffBlur}
        style={[styles.textInput, 
          {borderBottomColor: (this.state.isDropOffFocused? config.COLOR: '#000'),
          borderBottomWidth: this.state.isDropOffFocused? 2: 1,}]}
        onChangeText={dropOff =>{
          this.setState({ dropOff });
          this.onChangeDropOffDebounced(dropOff)}}/>

    {this.state.currentPlaceLoadingForPickUp &&
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
          onPress = {() => this.getCurrentLocationForPickUp()}
        >   Use current location</Text></View>}

      {this.state.currentPlaceLoadingForDropOff &&
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
            onPress = {() => this.getCurrentLocationForDropOff()}
          >   Use current location</Text></View>}

      {this.state.pickUploading && pickUpPredictions}
      {this.state.dropOffLoading && dropOffPredictions}

      {this.state.showNextIconAfterPickUp && this.state.showNextIconAfterDropOff &&
        <IconNext name = "ios-arrow-dropright-circle" size = {50} color = {config.COLOR}
          style = {{position: 'absolute',
          bottom:20,
          right:20,}}
          onPress = {() =>
            this.savePickUpDropOffLocations()}
          />}

      {this.state.isLoading && <ActivityIndicator size="large" />}

      {/* <IconNext name = "ios-arrow-dropright-circle" size = {50} color = {config.COLOR}
        style = {{position: 'absolute',
        bottom:20,
        right:20,}}
        onPress = {() =>
          this.savePickUpDropOffLocations()}
        />                     */}
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

})
