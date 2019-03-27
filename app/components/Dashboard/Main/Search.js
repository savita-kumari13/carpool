import React, { Component } from 'react'
import
{
  NavigationActions ,
  createStackNavigator,
  createAppContainer
} from 'react-navigation'

import RNGooglePlaces from 'react-native-google-places';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';

const locationIcon = (<Icon name = "my-location" size = {20} color = "grey" style = {{marginRight: 20}}/>)

import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native'

import { TextInput,} from 'react-native-paper';
import _ from 'lodash';


export default class Search extends Component {

  constructor(props)
  {
    super(props)
    this._handleBackHandler = this._handleBackHandler.bind(this);

    this.state = {
      leavingFrom: '',
      goingTo: '',

      leaveFromLongitude: 0,
      leaveFromLatitude: 0,

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
      currentPlaceLoadingForLeaveFrom: false,
      currentPlaceLoadingForGoingTo: false,
      
    };
    this.onChangeLeavingFromDebounced = _.debounce(this.onChangeLeavingFrom, 1000)
    this.onChangegoingToDebounced = _.debounce(this.onChangeGoingTo, 1000)
  }


componentDidMount()
{

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
    error => this.setState({error: error.message}),
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
   const leaveApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyAS9LdNhY87gL7k9dbldqRieSRXXlosMl4&input=${leavingFrom}&location=${this.state.leaveFromLatitude}, ${this.state.leaveFromLongitude}&radius=2000`;
      
   try{
    const leavResult = await fetch(leaveApiUrl);
    const leavingFromJson = await leavResult.json();
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
  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyAS9LdNhY87gL7k9dbldqRieSRXXlosMl4&input=${goingTo}&location=${this.state.goingToLatitude}, ${this.state.goingToLongitude}&radius=2000`;
  
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
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLocationLatitude},${this.state.currentLocationLongitude}&key=AIzaSyAS9LdNhY87gL7k9dbldqRieSRXXlosMl4&location_type=ROOFTOP`;

  try{
    const result = await fetch(apiUrl);
    const currentLocationJson = await result.json();
    console.log('currentLocationJson', currentLocationJson)
    this.setState({
      currentLocationPredictions: currentLocationJson.results,
    });

    this.state.currentLocationPredictions.map(currentLocationPrediction => (
      key = currentLocationPrediction.id,
      this.setCurrentLocationToLeaveFrom(currentLocationPrediction.formatted_address)
    ))
  }catch(err) {
   console.log(err)
 }

}

setCurrentLocationToLeaveFrom =(currentPlace) => {
  console.log('currentPlaceForLeavingPlace', currentPlace)
  this.setState({
    leavingFrom: currentPlace,
    leavingFromLoading: false,
    goingToLoading: false,
    currentPlaceLoadingForLeaveFrom: false,
    currentPlaceLoadingForGoingTo: false,
  })
}

async getCurrentLocationForGoingTo() {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.currentLocationLatitude},${this.state.currentLocationLongitude}&key=AIzaSyAS9LdNhY87gL7k9dbldqRieSRXXlosMl4&location_type=ROOFTOP`;

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
    leavingFromLoading: false,
    goingToLoading: false,
    currentPlaceLoadingForLeaveFrom: false,
    currentPlaceLoadingForGoingTo: false,
  })
}

setLeaveLocation (leavingPlace) {
  this.setState({
    leavingFrom: leavingPlace,
    leavingFromLoading: false,
    goingToLoading: false,
    currentPlaceLoadingForLeaveFrom: false,
  })
}

setGoingToLocation (goingPlace) {
  this.setState({
    goingTo: goingPlace,
    leavingFromLoading: false,
    goingToLoading: false,
    currentPlaceLoadingForLeaveFrom: false,
    currentPlaceLoadingForGoingTo: false
  })
}



setLeaveFromLoading = () => {
  this.setState({
    leavingFromLoading: true,
    goingToLoading: false,
    currentPlaceLoadingForLeaveFrom: true,
    currentPlaceLoadingForGoingTo: false
  })
}

setGoingToLoading = () => {
  this.setState({
    goingToLoading: true,
    leavingFromLoading: false,
    currentPlaceLoadingForLeaveFrom: false,
    currentPlaceLoadingForGoingTo: true
  })
}




  render() {

    const  leavingFromPredictions = this.state.leavingFromPredictions.map(leavingFromPrediction => (
        
        <Text
          style = {styles.suggestions}
          key = {leavingFromPrediction.id}
          onPress = {() => this.setLeaveLocation(leavingFromPrediction.description)}>{leavingFromPrediction.description}</Text>))

    const  goingToPredictions = this.state.goingToPredictions.map(goingToPrediction => (
      <Text
        style = {styles.suggestions}
        key = {goingToPrediction.id}
        onPress = {() => this.setGoingToLocation(goingToPrediction.description)}>{goingToPrediction.description}</Text>))


    return (
      <ScrollView >
        <SafeAreaView style={[ { backgroundColor: '#7963b6' }]}/>
          <Text style = {styles.findRide}>Find a ride</Text>

          <TextInput
            placeholder='Leaving from'
            mode = 'flat(disabled)'
            value={this.state.leavingFrom}
            style = {styles.textInput}
            onChangeText={leavingFrom =>{
              this.setState({ leavingFrom });
              this.onChangeLeavingFromDebounced(leavingFrom)}}
              onFocus = {this.setLeaveFromLoading}  
          />
          
          <TextInput
            placeholder='Going To'
            mode = 'flat(disabled)'
            value={this.state.goingTo}
            style = {styles.textInput}
            onChangeText={goingTo =>{
              this.setState({ goingTo });
              this.onChangegoingToDebounced(goingTo)}}
              onFocus = {this.setGoingToLoading} 
          />

          <View
          style = {{borderBottomColor:'#054752', borderBottomWidth: 1, margin: 10}}/>

          {this.state.currentPlaceLoadingForLeaveFrom && <Text
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
      
      </ScrollView>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    
  }


})



