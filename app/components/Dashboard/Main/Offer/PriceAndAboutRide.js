import React, { Component } from 'react'
import { 
    Text, 
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native'

import { Button,} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/EvilIcons'
import axios from '../../../axios'
import config from '../../../../config/constants'

export default class PriceAndAboutRide extends Component {

    constructor(props){
        super(props)

        this.state = {
            price : 50,
            isDisabledMinusIcon: false,
            isLessThanZero: config.COLOR,
            aboutText: '',
            isLoading: false,
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
                isLessThanZero: config.COLOR,
            })
        }
    }

async savePriceAndRideInfo() {

    this.setState({
        isLoading: true
    })
    try {
        await AsyncStorage.setItem('offered_price', JSON.stringify(this.state.price))

        await AsyncStorage.setItem('offered_ride_info', this.state.aboutText)

        let pickUpLocationName = (await AsyncStorage.getItem('pickup_location_name'))
        let dropOffLocationName = (await AsyncStorage.getItem('dropoff_location_name'))

        let pickUpLocationLatitude = JSON.parse(await AsyncStorage.getItem('pickup_location_latitude'))
        let pickUpLocationLongitude = JSON.parse(await AsyncStorage.getItem('pickup_location_longitude'))

        let dropOffLocationLatitude = JSON.parse(await AsyncStorage.getItem('dropoff_location_latitude'))
        let dropOffLocationLongitude = JSON.parse(await AsyncStorage.getItem('dropoff_location_longitude'))

        let offeredRideDateTimeString = JSON.parse(await AsyncStorage.getItem('offered_ride_date_time'))
        let offeredRideDateTimeObject = new Date(offeredRideDateTimeString)
        let offeredPassengersNumber = JSON.parse(await AsyncStorage.getItem('passengers_number'))
        let offeredPrice = JSON.parse(await AsyncStorage.getItem('offered_price'))
        let offeredRideInfo = (await AsyncStorage.getItem('offered_ride_info'))
        let offeredRideCar = JSON.parse(await AsyncStorage.getItem('car'))
    
        const offeredRide = {
            pick_up_name: pickUpLocationName,
            pick_up_coordinates: [pickUpLocationLongitude, pickUpLocationLatitude],
            drop_off_name: dropOffLocationName,
            drop_off_coordinates: [dropOffLocationLongitude, dropOffLocationLatitude],
            offered_ride_passengers_no: offeredPassengersNumber,
            offered_ride_price: offeredPrice,
            offered_ride_info: offeredRideInfo,
            offered_ride_date_time: offeredRideDateTimeObject,
            offered_ride_car: offeredRideCar
        }

        await axios.post(`/rides/offer_ride`,offeredRide)
        .then(res => {
            if(res.data.status){
                this.setState({
                    isLoading: false
                })
                this.props.navigation.navigate('Current')
                ToastAndroid.show('Ride posted successfully',ToastAndroid.TOP, ToastAndroid.SHORT);
            }
            else{
                this.setState({
                    isLoading: false
                })
                ToastAndroid.show(resData.messages.join(', '),ToastAndroid.TOP, ToastAndroid.SHORT);
            }
        })
        .catch(error => {
            this.setState({
                isLoading: false
            })
            console.log('error sending offered ride request ', error)
            ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT);
        })
    
    } catch (error) {
        this.setState({
            isLoading: false
        })
        console.log('Error in AsyncStorage ', error)
        ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
    }
}

  render() {

    const minusIcon = <Icon name = "minus" size = {60} color = {this.state.isLessThanZero}
        onPress = {() =>
        {console.log('Price decresed')
        }}
        />

    const plusIcon = <Icon name = "plus" size = {60}
        color = {config.COLOR}
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
                            color: config.TEXT_COLOR,
                            fontWeight: 'bold',
                            fontSize: 70,     
                            fontFamily: "sans-serif-condensed",}}>{this.state.price}</Text>

                <Button  
                    mode="text"
                    onPress = {() => {this.increasePrice()}}> {plusIcon}
                </Button>
            </View>

            <View style = {{marginTop: 60, justifyContent: 'flex-start'}}>
                <Text style = {styles.aboutRideText}>Anything to add about your ride?</Text>
                <TouchableOpacity style = {styles.aboutTextInput}>
                <ScrollView contentContainerStyle = {{justifyContent: 'flex-start', flex: 1}}>
                    <TextInput
                        multiline = {true}
                        numberOfLines = {6}                       
                        value = {this.state.aboutText}                      
                        placeholder = "Hello! I'm going to visit my family. I travel with a dog and I have a lot of space in the boot!"
                        onChangeText = {(aboutText) => {this.setState({aboutText})}}
                    ></TextInput>
                </ScrollView>
                </TouchableOpacity>
            </View>

            <View style = {{alignItems: 'center',position: 'relative', justifyContent: 'center', marginTop: 70 ,}}>
                <Button
                    style={styles.postRide}
                    onPress={() => {this.savePriceAndRideInfo()}}
                    loading = {this.state.isLoading}
                    mode = "contained">
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

      loader: {
          flex: 1,
          backgroundColor: 'grey'
      },

      priceText: {
        fontWeight: 'bold',
        fontFamily: "sans-serif-medium",
        fontSize: 30,
        fontWeight: 'bold',
        color: config.TEXT_COLOR,
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
        color: config.TEXT_COLOR,
        marginLeft:30,
      },

      aboutTextInput: {
          backgroundColor: '#e6e6e6',
          width: '80%',
          height: 150,
          marginLeft: '10%',
          borderRadius: 20,
          marginTop: 40,
          padding: 10,
      },

      postRide: {
        borderRadius: 30,
        width: 280,
        height: 45,
        backgroundColor: config.COLOR,
        justifyContent: 'center',
      }
    })
    