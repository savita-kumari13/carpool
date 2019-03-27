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
} from 'react-native'
import { TextInput, Button,} from 'react-native-paper';

import _ from 'lodash';

import IconLocation from 'react-native-vector-icons/MaterialIcons';
import IconNext from 'react-native-vector-icons/Ionicons'

const locationIcon = (<IconLocation name = "my-location" size = {20} color = "grey"
                                    style = {{marginRight: 20}}/>)

const nextIcon = (<IconNext name = "ios-arrow-dropright-circle" size = {50} color = "#7963b6"
                            style = {{position: 'absolute',
                            bottom:20,
                            right:20,}}
                            />)

export default class Offer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      error: '',

      pickUp: '',
      dropOff: '',

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
    }

    this.offerRideRef = firebase.firestore().collection('offerRide');


    this._handleBackHandler = this._handleBackHandler.bind(this);

    this.onChangePickUpDebounced = _.debounce(this.onChangePickUp, 0)
    this.onChangeDropOffDebounced = _.debounce(this.onChangeDropOff, 0)
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

 async onChangePickUp(pickUp) {
  this.setState(
    {
     pickUp,
   })
  const pickUpApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyAS9LdNhY87gL7k9dbldqRieSRXXlosMl4&input=${pickUp}&location=${this.state.pickUpLatitude}, ${this.state.pickUpLongitude}&radius=2000`;
     
  try{
   const pickUpResult = await fetch(pickUpApiUrl);
   const pickUpJson = await pickUpResult.json();
   console.log('pickUpJson', pickUpJson)

   this.setState({
     pickUpPredictions: pickUpJson.predictions,
   });
  }catch(err) {
    console.log(err)
  }

}

async onChangeDropOff(dropOff) {
  this.setState(
    {
     dropOff,
   })
  const dropOffApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyAS9LdNhY87gL7k9dbldqRieSRXXlosMl4&input=${dropOff}&location=${this.state.dropOfflatitude}, ${this.state.dropOfflongitude}&radius=2000`;
  
  try{
   const dropOffResult = await fetch(dropOffApiUrl);
   const dropOffJson = await dropOffResult.json();
   console.log('dropOffJson', dropOffJson)
   this.setState({
     dropOffPredictions: dropOffJson.predictions
   });
  }catch(err) {
    console.log(err)
  }

}

async getCurrentLocationForPickUp() {
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
      this.setCurrentLocationToPickUp(currentLocationPrediction.formatted_address)
    ))
  }catch(err) {
   console.log(err)
 }

}

setCurrentLocationToPickUp =(currentPlace) => {
  console.log('currentPlaceForPickUpPlace', currentPlace)
  this.setState({
    pickUp: currentPlace,
    pickUploading: false,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: false,
    currentPlaceLoadingForDropOff: false,
  })
}


async getCurrentLocationForDropOff() {
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
      this.setCurrentLocationToDropOff(currentLocationPrediction.formatted_address)
    ))
  }catch(err) {
   console.log(err)
 }

}

setCurrentLocationToDropOff =(currentPlace) => {
  console.log('currentPlaceForDropOff', currentPlace)
  this.setState({
    dropOff: currentPlace,
    pickUploading: false,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: false,
    currentPlaceLoadingForDropOff: false,
  })
}

setPickUpLocation (pickUpPlace) {
  this.setState({
    pickUp: pickUpPlace,
    pickUploading: false,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: false,
    showNextIconAfterPickUp: true,
  })
}

setDropOffLocation (dropOffPlace) {
  this.setState({
    dropOff: dropOffPlace,
    pickUploading: false,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: false,
    currentPlaceLoadingForDropOff: false,
    showNextIconAfterDropOff: true,
  })
}

setPickUpLoading = () => {
  this.setState({
    pickUploading: true,
    dropOffLoading: false,
    currentPlaceLoadingForPickUp: true,
    currentPlaceLoadingForDropOff: false
  })
}

setDropOffLoading = () => {
  this.setState({
    dropOffLoading: true,
    pickUploading: false,
    currentPlaceLoadingForPickUp: false,
    currentPlaceLoadingForDropOff: true
  })
}

goToCalendarScreen() {
  if(this.state.pickUp != this.state.dropOff)
  {
    console.log('Calendar')
    this.props.navigation.navigate('Calendarr')
  }
  else{
    alert('Please fill different places')
  }
  
}


  render() {

    const  pickUpPredictions = this.state.pickUpPredictions.map(pickUpPrediction => (
        
      <Text
        style = {styles.suggestions}
        key = {pickUpPrediction.id}
        onPress = {() => this.setPickUpLocation(pickUpPrediction.description)}>{pickUpPrediction.description}</Text>))

    const  dropOffPredictions = this.state.dropOffPredictions.map(dropOffPrediction => (
      <Text
        style = {styles.suggestions}
        key = {dropOffPrediction.id}
        onPress = {() => this.setDropOffLocation(dropOffPrediction.description)}>{dropOffPrediction.description}</Text>))


    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <SafeAreaView style={[{ backgroundColor: '#7963b6' }]}/>

        <Text style = {styles.findRide}>Offer a ride</Text>

        <TextInput
            placeholder='Pick-up'
            mode = 'flat(disabled)'
            value={this.state.pickUp}
            style = {styles.textInput}
            onChangeText={pickUp =>{
              this.setState({ pickUp });
              this.onChangePickUpDebounced(pickUp)}}
              onFocus = {this.setPickUpLoading}  
          />
          
          <TextInput
            placeholder='Drop-off'
            mode = 'flat(disabled)'
            value={this.state.dropOff}
            style = {styles.textInput}
            onChangeText={dropOff =>{
              this.setState({ dropOff });
              this.onChangeDropOffDebounced(dropOff)}}
              onFocus = {this.setDropOffLoading} 
          />

          <View
          style = {{borderBottomColor:'#054752', borderBottomWidth: 1, margin: 10}}/>

          {this.state.currentPlaceLoadingForPickUp && <Text
            style = {{backgroundColor: "#fff",
                      padding: 10,
                      fontSize: 16,
                      borderBottomWidth: 0.5,
                      marginLeft: 10,
                      }}
            onPress = {() => this.getCurrentLocationForPickUp()}
          >{locationIcon}Use current location</Text>}

          {this.state.currentPlaceLoadingForDropOff && <View><Text
            style = {{backgroundColor: "#fff",
            padding: 10,
            fontSize: 16,
            borderBottomWidth: 0.5,
            marginLeft: 10,}}
            onPress = {() => this.getCurrentLocationForDropOff()}
          >{locationIcon}Use current location</Text></View>}

        {this.state.pickUploading && pickUpPredictions}
        {this.state.dropOffLoading && dropOffPredictions}

        {this.state.showNextIconAfterPickUp && this.state.showNextIconAfterDropOff &&
         <IconNext name = "ios-arrow-dropright-circle" size = {50} color = "#7963b6"
                            style = {{position: 'absolute',
                            bottom:20,
                            right:20,}}
                            onPress = {() =>
                              this.goToCalendarScreen()}
                            />}
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 10,
  },

  findRide: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif-condensed',
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
