import React, { Component } from 'react'
import { 
    Text, 
    View,
    StyleSheet,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native'


import { Button,} from 'react-native-paper';

import Icon from 'react-native-vector-icons/EvilIcons'
import firebase  from 'react-native-firebase';
import axios from '../../../axios'

export default class PriceAndAboutRide extends Component {

    constructor(props){
        super(props)

        this.state = {
            price : 50,
            isDisabledMinusIcon: false,
            isLessThanZero: '#7963b6',

            aboutText: '',
        }       
    }

    decreasePrice() {
        this.setState({
            price: this.state.price - 10
        })

        if(this.state.price <= 10)
        {
            this.setState({
                isDisabledMinusIcon: true,
                isLessThanZero: '#e0e0d1',
            })
        }
        console.log('price ',this.state.price)

    }

    increasePrice() {
        this.setState({
            price: this.state.price + 10
        })
        if(this.state.price > -10){
            this.setState({
                isDisabledMinusIcon: false,
                isLessThanZero: '#7963b6',
            })
        }
    }

async savePriceAndRideInfo() {
    try {
        await AsyncStorage.setItem('offered_price', JSON.stringify(this.state.price))

        await AsyncStorage.setItem('offered_ride_info', this.state.aboutText)

        let pickUpLocationName = await AsyncStorage.getItem('pickup_location_name')
        let dropOffLocationName = await AsyncStorage.getItem('dropoff_location_name')

        let pickUpLocationLatitudeToParse = await AsyncStorage.getItem('pickup_location_latitude')
        let pickUpLocationLongitudeToParse = await AsyncStorage.getItem('pickup_location_longitude')

        let dropOffLocationLatitudeToParse = await AsyncStorage.getItem('dropoff_location_latitude')
        let dropOffLocationLongitudeToParse = await AsyncStorage.getItem('dropoff_location_longitude')

        let offeredRideDateTimeToParse = await AsyncStorage.getItem('offered_ride_date_time')
        let offeredPassengersNumberToParse = await AsyncStorage.getItem('passengers_number')
        let offeredPriceToParse = await AsyncStorage.getItem('offered_price')
        let offeredRideInfo = await AsyncStorage.getItem('offered_ride_info')

        let pickUpLocationLatitude = JSON.parse(pickUpLocationLatitudeToParse)
        let pickUpLocationLongitude = JSON.parse(pickUpLocationLongitudeToParse)

        let dropOffLocationLatitude = JSON.parse(dropOffLocationLatitudeToParse)
        let dropOffLocationLongitude = JSON.parse(dropOffLocationLongitudeToParse)

        let offeredRideDateTimeString = JSON.parse(offeredRideDateTimeToParse)
        let offeredRideDateTimeObject = new Date(offeredRideDateTimeString)

        let offeredPassengersNumber = JSON.parse(offeredPassengersNumberToParse)
        let offeredPrice = JSON.parse(offeredPriceToParse)
        
        const offeredRide = {
            pick_up_name: pickUpLocationName,
            pick_up_coordinates: [pickUpLocationLongitude, pickUpLocationLatitude],
            drop_off_name: dropOffLocationName,
            drop_off_coordinates: [dropOffLocationLongitude, dropOffLocationLatitude],
            offered_ride_passengers_no: offeredPassengersNumber,
            offered_ride_price: offeredPrice,
            offered_ride_info: offeredRideInfo,
            offered_ride_date_time: offeredRideDateTimeObject,
        }

        await axios.post(`/rides/offer_ride`,
            offeredRide
        )
        .then(res => {
            console.log('res received : ', res)
            this.props.navigation.navigate('Current')
        }).catch(error => {
            console.log('error sending offered ride request ', error)
        })
        
    } catch (error) {
        console.log('Error in AsyncStorage ', error)
    }
}

  render() {

    const minusIcon = <Icon name = "minus" size = {60} color = {this.state.isLessThanZero}
                    onPress = {() =>
                    {console.log('Price decresed')
                    }}
                    />

    const plusIcon = <Icon name = "plus" size = {60}
                    color = "#7963b6"
                    onPress = {() =>
                            {console.log('Price increased')
                            this.increasePrice()}}
                    />


    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <Text style = {styles.priceText}>Edit price per seat</Text>

            <View style = {styles.displayPrice}>
                <Button  
                    mode="text"
                    disabled = {this.state.isDisabledMinusIcon}
                    onPress = {() => {this.decreasePrice()}}> {minusIcon}
                </Button>

                <Text style = {{
                            color: '#054752',
                            fontWeight: 'bold',
                            fontSize: 70,     
                            fontFamily: "sans-serif-condensed",}}>{this.state.price}</Text>

                <Button  
                    mode="text"
                    onPress = {() => {this.increasePrice()}}> {plusIcon}
                </Button>
            </View>

            <View style = {{marginTop: 50, flex: 1}}>

                <Text style = {styles.aboutRideText}>Anything to add about your ride?</Text>

                <TouchableOpacity style = {styles.aboutTextInput}>
                <ScrollView>
                    <TextInput
                        multiline = {true}
                        numberOfLines = {6}                       
                        value = {this.state.aboutText}                      
                        placeholder = "Hello! I'm going to visit my family. I travel with a dog and I have a lot of space in the boot!"
                        onChangeText = {(aboutText) => {this.setState({aboutText})}}
                    ></TextInput>
                </ScrollView>
                </TouchableOpacity>

                <Button mode = "contained" style = {styles.postRide}
                            onPress = {() => {this.savePriceAndRideInfo()}}>
                            <Text style = {{color: '#fff', fontWeight: 'bold' }}>Post ride</Text>

                </Button>
            </View>
        </ScrollView>        
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
      },

      priceText: {
        fontWeight: 'bold',
        fontFamily: "sans-serif-medium",
        fontSize: 30,
        fontWeight: 'bold',
        color: '#054752',
        marginLeft: 30,
      },

      displayPrice: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      },


      aboutRideText: {
        fontWeight: 'bold',
        fontFamily: "sans-serif-medium",
        fontSize: 30,
        fontWeight: 'bold',
        color: '#054752',
        marginLeft:30,
      },

      aboutTextInput: {
          backgroundColor: '#e6e6e6',
          width: '80%',
          marginLeft: '10%',
          borderRadius: 20,
          marginTop: 30,
          padding: 10,
      },

      postRide: {
        borderRadius: 30,
        width: 100,
        height: 40,
        backgroundColor: "#7963b6",
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        left: '35%',
      }
    })
    