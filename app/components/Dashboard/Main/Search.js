import React, { Component } from 'react'
import
{
  NavigationActions ,
  createStackNavigator,
  createAppContainer
} from 'react-navigation'

import RNGooglePlaces from 'react-native-google-places';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native'

import { TextInput } from 'react-native-paper';

export default class Search extends Component {

  constructor(props)
  {
    super(props)
    this._handleBackHandler = this._handleBackHandler.bind(this);

    this.state = {
      leavingFrom: '',
      goingTo: '',
    }
  }


componentDidMount()
{

  this._navListener = this.props.navigation.addListener('didFocus', () => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#7963b6');
  });

  BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);
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


 openSearchModalForLeavingFrom()
 {
    RNGooglePlaces.openAutocompleteModal({
      country: 'IN'
    })
    .then((place) => {
    console.log(place);
    this.setState({ leavingFrom: place.address })
    })
    .catch(error => {
      console.log('error occurred', error.message)});
  }

openSearchModalForGoingTo()
{
    RNGooglePlaces.openAutocompleteModal({
      country: 'IN'
    })
    .then((place) => {
      console.log(place);
    // console.log(place.viewport);
    this.setState({ goingTo: place.address })
    })
    .catch(error => {
      console.log('error occurred', error.message)});

  }


  GooglePlacesInput = () => {

    const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
    const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

    console.log('entered current location function')
  }




  render() {
    return (
      <View>
        <SafeAreaView style={[styles.container, { backgroundColor: '#7963b6' }]}/>
        <Text style = {styles.findRide}>Find a ride</Text>

        <TextInput
        placeholder='Leaving from'
        mode = 'flat(disabled)'
        value={this.state.leavingFrom}
        style = {styles.textInput}
        // onChangeText={leavingFrom => this.setState({ leavingFrom })}
        onFocus={() => this.openSearchModalForLeavingFrom()}
      />

      <TextInput
        placeholder='Going to' 
        mode = 'flat(disabled)'
        value={this.state.goingTo}
        style = {styles.textInput}
        // onChangeText={goingTo => this.setState({ goingTo })}
        onFocus={() => this.openSearchModalForGoingTo()}
      />

<TextInput
        placeholder='Current location' 
        mode = 'flat(disabled)'
        // value={this.state.goingTo}
        style = {styles.textInput}
        // onChangeText={goingTo => this.setState({ goingTo })}
        onFocus={this.GooglePlacesInput}
      />
<GooglePlacesAutocomplete
  placeholder='Enter Location'
  minLength={2}
  autoFocus={false}
  returnKeyType={'default'}
  fetchDetails={true}
  query={{
    key: 'AIzaSyCd7zzn84kWlmY-okvJwVhubs8weyco22s',
    language: 'en', // language of the results
    types: '(cities)' // default: 'geocode'
  }}
  styles={{
    textInputContainer: {
      backgroundColor: 'rgba(0,0,0,0)',
      borderTopWidth: 0,
      borderBottomWidth:0
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 38,
      color: '#5d5d5d',
      fontSize: 16
    },
    predefinedPlacesDescription: {
      color: '#1faadb'
    },
  }}
  currentLocation={true}
/>

      
      </View>
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


})



