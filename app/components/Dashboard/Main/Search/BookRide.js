import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    ScrollView
    } from 'react-native'
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import StepIndicator from 'react-native-step-indicator';
import axios from '../../../axios'

import Icon from 'react-native-vector-icons/EvilIcons'
import RupeeIcon from 'react-native-vector-icons/FontAwesome'

const customStyles = {
  stepIndicatorSize: 8,
  currentStepIndicatorSize: 8,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 2,
  stepStrokeWidth: 2,
  stepStrokeCurrentColor: '#054752',
  stepStrokeFinishedColor: '#054752',
  stepStrokeUnFinishedColor: '#054752',
  separatorFinishedColor: '#054752',
  separatorUnFinishedColor: '#054752',
  stepIndicatorFinishedColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: '#054752',
  stepIndicatorLabelFinishedColor: '#054752',
  stepIndicatorLabelUnFinishedColor: '#054752',
  labelColor: '#054752',
  labelSize: 17,
  currentStepLabelColor: '#054752',
  // labelAlign: 'center',
  labelFontFamily: 'sans-serif-medium'
}

export default class BookRide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rideId: null,
      leaveLocation: '',
      goingLocation: '',
      price: null,
      seats: 1,
      passengerNo: 0,
      isDisabledMinusIcon: true,
      isDisabledPlusIcon: false,
      isLessThanOne: '#e0e0d1',
      isGreaterThanSeats: '#7963b6',
      date: new Date(),
      day: '',
      todayTommorow: false,
      currentPosition: 0,
      labels: [],
      monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ],

      daysNames : ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
          ],
      bookedSuccessfull: false,
    }
  }
  componentDidMount(){

    gettingRideDetails = async() => {
      const id = JSON.parse(await AsyncStorage.getItem('ride_id'))
      const leave_location = JSON.parse(await AsyncStorage.getItem('leave'))
      const going_location = JSON.parse(await AsyncStorage.getItem('going'))
      const ride_price = JSON.parse(await AsyncStorage.getItem('price'))
      const passenger_no = JSON.parse(await AsyncStorage.getItem('passenger'))
      const ride_date = JSON.parse(await AsyncStorage.getItem('date'))
      const pickedDate = new Date(ride_date)
      const today = new Date()
      if(pickedDate.getDate() == today.getDate()){
        this.setState({
          day: 'Today',
          todayTommorow: true
        })
      }
      if(pickedDate.getDate() == today.getDate() + 1){
        this.setState({
          day: 'Tommorow',
          todayTommorow: true
        })
      }
      this.setState({
        rideId: id,
        leaveLocation: leave_location,
        goingLocation: going_location,
        price: ride_price,
        passengerNo: passenger_no,
        date: pickedDate,
      })
      if(this.state.seats == this.state.passengerNo){
        this.setState({
          isDisabledPlusIcon: true,
          isGreaterThanSeats: '#e0e0d1'
        })
      }
    }
    gettingRideDetails()
  }

  decreasePassengersNumber() {
    this.setState({
        seats: this.state.seats - 1
    })

    if(this.state.seats <= 2)
    {
        this.setState({
            isDisabledMinusIcon: true,
            isLessThanOne: '#e0e0d1'
        })
    }
    if(this.state.seats < this.state.passengerNo + 2){
      this.setState({
          isDisabledPlusIcon: false,
          isGreaterThanSeats: '#7963b6'
      })
    }
    console.log('number ',this.state.seats - 1)

}

increasePassengersNumber() {
    this.setState({
      seats: this.state.seats + 1
    })
    if(this.state.seats > 0){
        this.setState({
            isDisabledMinusIcon: false,
            isLessThanOne: '#7963b6'
        })
    }
    if(this.state.seats > (this.state.passengerNo - 2)){
      this.setState({
          isDisabledPlusIcon: true,
          isGreaterThanSeats: '#e0e0d1'
      })
  }
}

async setBookedRide(rides){
  await AsyncStorage.setItem('booked_ride_data', JSON.stringify(rides))
  await AsyncStorage.setItem('current_ride', JSON.stringify(true))
  this.props.navigation.navigate('Current')
}

async bookingRide(){
  const bookRide = {
    ride_id: this.state.rideId,
    seats_booked: this.state.seats,
    passenger_no: this.state.passengerNo
  }
  let rideData = null
  
  await axios.post('/rides/book', bookRide)
  .then(res => {
    console.log('book ride res : ', res)
    rideData = res.data.response.rides
    // setBookedRide(res.data.response.rides)
  })
  .catch(err => {
    console.log('error sending booking ride request', err)
  })
  console.log('rideData ', rideData)
  await AsyncStorage.setItem('booked_ride_data', JSON.stringify(rideData))
  await AsyncStorage.setItem('current_ride', JSON.stringify(true))
  this.props.navigation.navigate('Current')
}


  render() {
    const minusIcon = <Icon name = "minus" size = {50} color = {this.state.isLessThanOne}/>

    const plusIcon = <Icon name = "plus" size = {50} color = {this.state.isGreaterThanSeats }/> 

    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <Text style = {styles.checkDetails}>Check details and book!</Text>
        {this.state.todayTommorow &&  <View style = {{marginTop: 20}}>
          <Text 
            style = {styles.date}>{this.state.day}, {this.state.hours}:{this.state.minutes}
          </Text>
        </View>}
    
        {!this.state.todayTommorow && <View style = {{marginTop: 20}}>
          <Text 
            style = {styles.date}>
            {this.state.daysNames[this.state.date.getDay()]}, {this.state.date.getDate()} {this.state.monthNames[this.state.date.getMonth()]}
          </Text>
        </View>}

        <View style = {{marginTop: 40, marginLeft: 20, justifyContent: 'space-between',}}>
          <StepIndicator
            customStyles={customStyles}
            direction='vertical'
            stepCount={2}
            currentPosition={this.state.currentPosition}
            labels={[this.state.leaveLocation, this.state.goingLocation]}
          />
          </View>

          <Text style = {styles.seatsNumber}>Number of seats to book</Text>
          <View style = {styles.passengerNo}>
            <Button  
                mode="text"
                disabled = {this.state.isDisabledMinusIcon}
                onPress = {() => {this.decreasePassengersNumber()}}> {minusIcon}
            </Button>

            <Text style = {{
                          color: '#054752',
                          fontWeight: 'bold',
                          fontSize: 50,
                          fontFamily: "sans-serif-condensed",}}>{this.state.seats}</Text>

            <Button  
                  mode="text"
                  disabled = {this.state.isDisabledPlusIcon}
                  onPress = {() => {this.increasePassengersNumber()}}> {plusIcon}
            </Button>                    
          </View>
          
          <View style={{
            marginTop: 30,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
          }}/>

          <View style = {{flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' }}>
            <View>
                <Text style = {{
                    marginTop: 7,
                    color: '#054752',
                    fontWeight: 'bold',
                    fontSize: 17,
                    }}>Total</Text>
            </View>

            <View style = {{flexDirection: "row" }}>
                <RupeeIcon name = 'rupee' size = {20} color = '#054752' style = {{marginTop: 7}} />
                <Text style = {{
                    marginLeft: 2,
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#054752',
                    fontFamily: "sans-serif-condensed",
                    }}>{this.state.seats * this.state.price}</Text>
            </View>
          </View>

          <View style = {{position: 'absolute', justifyContent: 'center',bottom: 20, left: 130}}>
            <Button
                style={styles.bookRideButton}
                onPress={() => this.bookingRide()}
                mode = "contained">
                <Text style = {{color: '#fff', fontWeight: 'bold' }}>Book</Text>
            </Button> 
          </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    // showsVerticalScrollIndicator: false 
  },

  checkDetails: {
    fontWeight: 'bold',
    fontFamily: "sans-serif-medium",
    fontSize: 30,
    fontWeight: 'bold',
    color: '#054752',
    marginTop: 20,
  },

  seatsNumber: {
    fontWeight: 'bold',
    fontFamily: "sans-serif-medium",
    fontSize: 30,
    fontWeight: 'bold',
    color: '#054752',
    marginTop: 60,
  },

  date: {
    color: '#054752',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: "sans-serif-condensed",
    marginTop: 20,
  },

  passengerNo: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  bookRideButton: {
    borderRadius: 30,
    width: 100,
    height: 45,
    backgroundColor: "#7963b6",
    justifyContent: 'center',
  }
})
