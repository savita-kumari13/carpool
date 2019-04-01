import React, { Component } from 'react'
import { 
    Text, 
    View,
    StyleSheet,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
    ScrollView,
} from 'react-native'

import { Button,} from 'react-native-paper';

import Icon from 'react-native-vector-icons/EvilIcons'
import firebase, { Firebase } from 'react-native-firebase';


export default class PriceAndAboutRide extends Component {

    constructor(props){
        super(props)

        this.state = {
            price : 50,
            isDisabledMinusIcon: false,
            isLessThanZero: '#7963b6',

            aboutText: '',
        }
        this.userRef = firebase.firestore().collection('users')
        this.offeredRideRef = firebase.firestore().collection('offered_ride')
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

            const pickUpLocationName = await AsyncStorage.getItem('pickup_location_name')
            const dropOffLocationName = await AsyncStorage.getItem('dropoff_location_name')

            const pickUpLocationLatitudeToParse = await AsyncStorage.getItem('pickup_location_latitude')
            const pickUpLocationLongitudeToParse = await AsyncStorage.getItem('pickup_location_longitude')

            const dropOffLocationLatitudeToParse = await AsyncStorage.getItem('dropoff_location_latitude')
            const dropOffLocationLongitudeToParse = await AsyncStorage.getItem('dropoff_location_longitude')

            const offeredRideDateToParse = await AsyncStorage.getItem('offered_ride_date')
            const offeredRideTimeToParse = await AsyncStorage.getItem('offered_ride_time')
            const offeredPassengersNumberToParse = await AsyncStorage.getItem('passengers_number')
            const offeredPriceToParse = await AsyncStorage.getItem('offered_price')
            const offeredRideInfo = await AsyncStorage.getItem('offered_ride_info')

            const pickUpLocationLatitude = JSON.parse(pickUpLocationLatitudeToParse)
            const pickUpLocationLongitude = JSON.parse(pickUpLocationLongitudeToParse)

            const dropOffLocationLatitude = JSON.parse(dropOffLocationLatitudeToParse)
            const dropOffLocationLongitude = JSON.parse(dropOffLocationLongitudeToParse)

            const offeredRideDate = JSON.parse(offeredRideDateToParse)
            const offeredRideTime = JSON.parse(offeredRideTimeToParse)
            const offeredPassengersNumber = JSON.parse(offeredPassengersNumberToParse)
            const offeredPrice = JSON.parse(offeredPriceToParse)
    
            console.log('pickUp : ', pickUpLocationName)
            console.log('dropOff : ', dropOffLocationName)

            console.log('pickUpLocationLatitude : ', pickUpLocationLatitude)
            console.log('pickUpLocationLongitude : ', pickUpLocationLongitude)

            console.log('dropOffLocationLatitude : ', dropOffLocationLatitude)
            console.log('dropOffLocationLongitude : ', dropOffLocationLongitude)

            console.log('offeredRideDate : ', offeredRideDate)
            console.log('offeredRideTime : ', offeredRideTime)
            console.log('offeredPassengersNumber : ', offeredPassengersNumber)
            console.log('offeredPrice : ', offeredPrice)
            console.log('offeredRideInfo : ', offeredRideInfo)
            

            let currentUser = firebase.auth().currentUser

            // if(currentUser)
            // {
            //      // console.log('refence ', db.collection('users').doc(currentUser.uid))
                
            //     let offeredRideUserEmail = currentUser._user.email
            //     console.log('current user email ', offeredRideUserEmail)

            //     let userRideDoc = this.userRef.doc(offeredRideUserEmail)

                

            //     userRideDoc.onSnapshot(function (doc) {
            //         if(doc.exists)
            //         {
            //             console.log("onSnapshot data : ", doc.data())
            //         } else
            //         {
            //             console.log("No such user exists");
            //         }
                    

            //     }
            //     )

            //     // userRideDoc.get().then(function(doc) {
            //     //     if (doc.exists) {
            //     //         console.log("Document data:", doc.data());
                        
                        
            //     //     } else {
            //     //         // doc.data() will be undefined in this case
            //     //         console.log("No such document!");
            //     //     }
            //     // }).catch(function(error) {
            //     //     console.log("Error getting document:", error);
            //     // });

            //     this.offeredRideUserDoc = this.offeredRideRef.doc(offeredRideUserEmail)
            //     // if(!this.offeredRideUserDoc.exists)
            //     // {
            //     //     // this.offeredRideUserDoc.collection('ride_offerring_user').doc(offeredRideUser).set({
            //     //     //     pickup_location: pickUp,
            //     //     //     dropOff_location: dropOff,
            //     //     //     offered_ride_date: offeredRideDate,
            //     //     //     offered_ride_time: offeredRideTime,
            //     //     //     offered_passengers_number: offeredPassengersNumber,
            //     //     //     offered_price: offeredPrice,
            //     //     //     offered_ride_info: offeredRideInfo
            //     //     // }).then(() =>{
            //     //     //     console.log("offered ride data added ot firestore")
            //     //     // }).catch((error) => {
            //     //     //     console.error("error adding offered ride data to firestore ", error);
            //     //     // })

            //     //     this.offeredRideUserDoc.set({
            //     //         pickup_location: pickUp,
            //     //         dropOff_location: dropOff,
            //     //         offered_ride_date: offeredRideDate,
            //     //         offered_ride_time: offeredRideTime,
            //     //         offered_passengers_number: offeredPassengersNumber,
            //     //         offered_price: offeredPrice,
            //     //         offered_ride_info: offeredRideInfo
            //     //     }).then(() =>{
            //     //         console.log("offered ride data added ot firestore")
            //     //     }).catch((error) => {
            //     //         console.error("error adding offered ride data to firestore ", error);
            //     //     })
            //     // }


               
            // }
    
    
            // this.props.navigation.navigate('Current')
            
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
