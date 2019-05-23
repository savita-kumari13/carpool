import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    ActivityIndicator,
    ToastAndroid
    } from 'react-native'
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../../../axios'

import Icon from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import RupeeIcon from 'react-native-vector-icons/FontAwesome'
import config from '../../../../config/constants'

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
      isGreaterThanSeats: config.COLOR,
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
      isLoadingRide: false,
      isLoading: false,
    }
  }
  componentDidMount(){

    gettingRideDetails = async() => {
      this.setState({
        isLoadingRide: true
      })
      try {
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
        this.setState({
          isLoadingRide: false
        })
      } catch (error) {
        this.setState({
          isLoadingRide: false
        })
        ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
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
          isGreaterThanSeats: config.COLOR
      })
    }

}

increasePassengersNumber() {
    this.setState({
      seats: this.state.seats + 1
    })
    if(this.state.seats > 0){
        this.setState({
            isDisabledMinusIcon: false,
            isLessThanOne: config.COLOR
        })
    }
    if(this.state.seats > (this.state.passengerNo - 2)){
      this.setState({
          isDisabledPlusIcon: true,
          isGreaterThanSeats: '#e0e0d1'
      })
  }
}

async bookingRide(){
  this.setState({
    isLoading: true
  })
  const bookRide = {
    ride_id: this.state.rideId,
    seats_booked: this.state.seats,
    passenger_no: this.state.passengerNo
  }
  await axios.post('/rides/book', bookRide)
  .then(res => {
    if(res.data.status){
      this.setState({
        isLoading: false
      })
      ToastAndroid.show('Ride booked', ToastAndroid.SHORT)
      this.props.navigation.navigate('Current')
    }
    else{
      this.setState({
        isLoading: false
      })
      ToastAndroid.show('Error while booking ride', ToastAndroid.SHORT)
    }
  })
  .catch(err => {
    this.setState({
      isLoading: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  })
}


  render() {
    const minusIcon = <Icon name = "minus" size = {50} color = {this.state.isLessThanOne}/>

    const plusIcon = <Icon name = "plus" size = {50} color = {this.state.isGreaterThanSeats }/> 

    return (
      <ScrollView contentContainerStyle = {styles.container}>
      {this.state.isLoadingRide && <ActivityIndicator size="large" />}
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

        <View style = {{ flexDirection: 'column',}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <Ionicons.Button
              name="md-pin"
              backgroundColor='transparent'
              underlayColor='transparent'
              color={'#3d5c5c'}
              size={16}
            />
            <View style={{flexWrap: 'wrap', flex: 1}}>
              <Text style={{color: config.TEXT_COLOR, fontSize: 16, marginLeft: -5, flexWrap: 'wrap'}}>{this.state.leaveLocation}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10,}}>
            <Ionicons.Button
              name="md-pin"
              backgroundColor='transparent'
              underlayColor='transparent'
              color={'#3d5c5c'}
              size={16}
            />
            <View style={{flexWrap: 'wrap', flex: 1}}>
              <Text style={{color: config.TEXT_COLOR, fontSize: 16, marginLeft: -5,}}>{this.state.goingLocation}</Text>
            </View>
          </View>
        </View>

        <Text style = {styles.seatsNumber}>Number of seats to book</Text>
        <View style = {styles.passengerNo}>
          <Button  
              mode="text"
              disabled = {this.state.isDisabledMinusIcon}
              onPress = {() => {this.decreasePassengersNumber()}}> {minusIcon}
          </Button>

          <Text style = {{
                        color: config.TEXT_COLOR,
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
                  color: config.TEXT_COLOR,
                  fontWeight: 'bold',
                  fontSize: 17,
                  }}>Total</Text>
          </View>

          <View style = {{flexDirection: "row" }}>
              <RupeeIcon name = 'rupee' size = {20} color = {config.TEXT_COLOR} style = {{marginTop: 7}} />
              <Text style = {{
                  marginLeft: 2,
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: config.TEXT_COLOR,
                  fontFamily: "sans-serif-condensed",
                  }}>{this.state.seats * this.state.price}</Text>
          </View>
        </View>

        <View style = {{alignItems: 'center', marginTop: 90}}>
          <Button
              style={styles.bookRideButton}
              loading = {this.state.isLoading}
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
    color: config.TEXT_COLOR,
    marginTop: 20,
  },

  seatsNumber: {
    fontWeight: 'bold',
    fontFamily: "sans-serif-medium",
    fontSize: 30,
    fontWeight: 'bold',
    color: config.TEXT_COLOR,
    marginTop: 50,
  },

  date: {
    color: config.TEXT_COLOR,
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
    width: 280,
    height: 45,
    backgroundColor: config.COLOR,
    justifyContent: 'center',
  }
})
