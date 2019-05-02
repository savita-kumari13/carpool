import React, { Component } from 'react'
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    } from 'react-native'
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../../../axios'
import NavigationService from '../../../../../NavigationService';
import config from '../../../../config/constants'

import ArrowIcon from 'react-native-vector-icons/Ionicons'
import ArrowIcon2 from 'react-native-vector-icons/Ionicons'
import LineIcon from 'react-native-vector-icons/Entypo'
import RupeeIcon from 'react-native-vector-icons/FontAwesome'

export default class UserAndRideInfo extends Component {

    constructor(props){
        super(props)
        this.state = {
            leaveLocation: '',
            goingLocation: '',
            price: 0,
            passengerNo: 0,
            info: '',
            date: new Date(),
            userName: '',
            userPhoneNumber: '',
            userPreferences:'',

            monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ],

            daysNames : ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                ],

            bookedUsers: [],

            infoVisible: false,

            smokingVisible: false,
            smokeOkVisible: false,
            noSmokeVisible: false,

            petsVisible: false,
            petsOkVisible: false,
            noPetsVisible: false,

            chattinessVisible: false,
            musicVisible: false,

            alreadyBooked: false,
          }
        }

    componentDidMount(){
        gettingUserRideDetails = async() =>{       
            const leave_location = JSON.parse(await AsyncStorage.getItem('leave'))
            const going_location = JSON.parse(await AsyncStorage.getItem('going'))
            const ride_price = JSON.parse(await AsyncStorage.getItem('price'))
            const passenger_no = JSON.parse(await AsyncStorage.getItem('passenger'))
            const ride_info = JSON.parse(await AsyncStorage.getItem('info'))
            if(ride_info != 'null' && ride_info !== null && ride_info !== undefined )
            {
                this.setState({
                    infoVisible: true,
                })
            }
            const booked_users = JSON.parse(await AsyncStorage.getItem('booked_user'))
            if(booked_users.length > 0){
                console.log('booked user ', booked_users)
                    this.setState({
                        alreadyBooked: true,
                        bookedUsers: booked_users
                    })
            }
            const ride_date = JSON.parse(await AsyncStorage.getItem('date'))
            const pickedDate = new Date(ride_date)
            const user_name = JSON.parse(await AsyncStorage.getItem('user_name'))
            const user_phone_number = JSON.parse(await AsyncStorage.getItem('user_phone_number'))
            const user_preferences = JSON.parse(await AsyncStorage.getItem('preferences'))

            this.setState({
                leaveLocation: leave_location,
                goingLocation: going_location,
                price: ride_price,
                passengerNo: passenger_no,
                date: pickedDate,
                info: ride_info,
                userName: user_name,
                userPhoneNumber: user_phone_number,
                userPreferences: user_preferences
            })

            if(this.state.userPreferences.smoking === config.SMOKING.NO_SMOKING || this.state.userPreferences.smoking === config.SMOKING.YES_SMOKING)
            {
                this.setState({
                    smokingVisible: true
                })
            }
            if(this.state.userPreferences.smoking === config.SMOKING.NO_SMOKING)
            {
                this.setState({
                    noSmokeVisible: true,
                    smokeOkVisible: false
                })
            }
            if( this.state.userPreferences.smoking === config.SMOKING.YES_SMOKING)
            {
                this.setState({
                    smokeOkVisible: true,
                    noSmokeVisible: false,
                })
            }


            if(this.state.userPreferences.pets === config.PETS.NO_PETS || this.state.userPreferences.pets === config.PETS.PETS_WELCOME)
            {
                this.setState({
                    petsVisible: true
                })
            }
            if(this.state.userPreferences.pets === config.PETS.NO_PETS )
            {
                this.setState({
                    noPetsVisible: true,
                    petsOkVisible: false,
                })
            }
            if( this.state.userPreferences.pets === config.PETS.PETS_WELCOME)
            {
                this.setState({
                    petsOkVisible: true,
                    noPetsVisible: false,
                })
            }
            if(this.state.userPreferences.chattiness === config.CHATTINESS.QUIT_TYPE || this.state.userPreferences.chattiness === config.CHATTINESS.LOVE_TO_CHAT)
            {
                this.setState({
                    chattinessVisible: true
                })
            }
            if(this.state.userPreferences.music === config.MUSIC.SILENCE || this.state.userPreferences.music === config.MUSIC.ALL_ABOUT_PLAYLIST)
            {
                this.setState({
                    musicVisible: true
                })
            }
        }
            gettingUserRideDetails()
        }

       async bookedUserPreferences(bookedUser){
            await AsyncStorage.setItem('booked_user', JSON.stringify(bookedUser))
            this.props.navigation.navigate('bookedUserPreferences')
        }
  render() {

    const bookedUsers = this.state.bookedUsers.map(bookedUser => (
        <View style = {{flexDirection: "row", marginTop: 10,justifyContent: 'space-between',}} key = {bookedUser._id}>
            <Text style = {{
            fontSize: 18,
            marginTop: 20,
            fontWeight: 'bold',
            color: '#054752',
            }}>{bookedUser.name}</Text>
            <TouchableWithoutFeedback onPress = {() => this.bookedUserPreferences(bookedUser)} >
                <View style = {{marginLeft: 120, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                    <ArrowIcon2 name = 'ios-arrow-forward' 
                        size = {20}
                        color = '#527a7a'
                        style = {{marginLeft: 15, marginTop: 15, }}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
        ))

    return (
        <View style = {styles.container}>
      <ScrollView contentContainerStyle = {{flexGrow: 1}}>
        <View >
            <Text style = {styles.date}>
                {this.state.daysNames[this.state.date.getDay()]} {this.state.date.getDate()} {this.state.monthNames[this.state.date.getMonth()]}
            </Text>
        </View>   
        
        <View style = {styles.rideItemView}>
            <Text style = {styles.location}>{this.state.leaveLocation}</Text>
            <View style = {{alignItems: 'center'}}>
                <ArrowIcon name = 'md-arrow-down' size = {20} color = '#054752' />
            </View>
            <Text style = {styles.location}>{this.state.goingLocation}</Text>
        </View> 

        <View style = {{flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' }}>
            <View>
                <Text style = {{
                    marginTop: 7,
                    color: '#527a7a',
                    fontWeight: 'bold',
                    fontSize: 16,
                    }}>{this.state.passengerNo} seats available</Text>
            </View>

            <View style = {{flexDirection: "row" }}>
                <RupeeIcon name = 'rupee' size = {20} color = '#054752' style = {{marginTop: 7}} />
                <Text style = {{
                    marginLeft: 2,
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#054752',
                    fontFamily: "sans-serif-condensed",
                    }}>{this.state.price}</Text>
            </View>
        </View>

        <Text style = {{
            alignSelf: 'flex-end',
            color: '#527a7a',
            fontWeight: 'bold',
            fontSize: 16,
            }}>per seat
        </Text>

        <View style={{
            marginTop: 35,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
        }}/>

        <View style = {{flexDirection: "row", marginTop: 20,justifyContent: 'space-between'}} >
            <Text style = {{
            fontSize: 18,
            marginTop: 20,
            fontWeight: 'bold',
            color: '#054752',
            }}>{this.state.userName}</Text>
            <TouchableWithoutFeedback onPress = {() => this.props.navigation.navigate('UserBio')} >
                <View style = {{marginLeft: 120, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                    <ArrowIcon2 name = 'ios-arrow-forward' 
                        size = {20}
                        color = '#527a7a'
                        style = {{marginLeft: 15, marginTop: 15, }}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>

        {this.state.infoVisible && <Text style = {{
            fontSize: 16,
            marginTop: 15,
            fontWeight: 'bold',
            color: '#527a7a',
            }}>{this.state.info}</Text>}

        <Text style = {{
            fontSize: 16,
            marginTop: this.state.infoVisible? 25: 20,
            //  fontFamily: 'sans-serif-medium',
            fontWeight: 'bold',
            color: '#7963b6',
            }}>Contact {this.state.userName}</Text>

        <View style={{
            marginTop: 30,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
        }}/>

        {this.state.smokingVisible && this.state.noSmokeVisible &&
        <View style = {{marginTop: 20, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/no_smoking.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.smoking}
            </Text>
        </View>}

        {this.state.smokingVisible && this.state.smokeOkVisible &&
        <View style = {{marginTop: 20, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/smoking.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.smoking}
            </Text>
        </View>}

        {this.state.petsVisible && this.state.petsOkVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/pet.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.pets}
            </Text>
        </View>}

        {this.state.petsVisible && this.state.noPetsVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/no_pet.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.pets}
            </Text>
        </View>}

        {(this.state.smokingVisible || this.state.petsVisible )&& <View style={{
            marginTop: 30,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
        }}/>}

        {this.state.alreadyBooked && 
        <Text style = {styles.booked}>Already booked this ride</Text>}
        {this.state.alreadyBooked && bookedUsers}

        {this.state.alreadyBooked && 
        <View style={{
                    marginTop: 30,
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 1,
                }}/>}
    
      </ScrollView>
      <View style = {{alignItems: 'center',position: 'relative', justifyContent: 'center',
         bottom: 0, marginTop: 20 }}>
        <Button
            style={styles.continueBtn}
            onPress={() => this.props.navigation.navigate('BookRide')}
            mode = "contained">
            <Text style = {{color: '#fff', fontWeight: 'bold' }}>Continue</Text>
        </Button> 
      </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // showsVerticalScrollIndicator: false 
      },
  
    date: {
      color: '#054752',
      fontWeight: 'bold',
      fontSize: 33,
      fontFamily: "sans-serif-condensed",
    },

    location: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#054752',
        flexWrap: 'wrap',
    },

    rideItemView: {
        marginTop: 30,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
      },

      avatar: {
        width: 50,
        height: 50,
        borderRadius: 63,
        borderWidth: 4,
      },

      smoke: {
        marginTop: 8,
        marginLeft: 15,
        color: '#527a7a',
        fontWeight: 'bold',
        fontSize: 16,
      },

      continueBtn:{
        borderRadius: 30,
        width: 300,
        height: 45,
        backgroundColor: "#7963b6",
        justifyContent: 'center',
      },

      booked: {
        fontWeight: 'bold',
        fontFamily: "sans-serif-medium",
        fontSize: 20,
        fontWeight: 'bold',
        color: '#054752',
        marginTop: 30,
      }
})