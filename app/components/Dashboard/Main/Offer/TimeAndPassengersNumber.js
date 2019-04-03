import React, { Component } from 'react'
import { 
    Text,
    View,
    TouchableOpacity ,
    StyleSheet,
    AsyncStorage,
} from 'react-native'

import { TextInput, Button,} from 'react-native-paper';

import DateTimePicker from 'react-native-modal-datetime-picker';


import Icon from 'react-native-vector-icons/EvilIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'

export default class TimeAndPassengersNumber extends Component {

    constructor(props){
        super(props)

        this.state = {
            pickedDate: new Date(),
            isDateTimePickerVisible: false,
            hours : new Date().getHours(),
            minutes : new Date().getMinutes(),

            passengersNumber : 3,
            isDisabledMinusIcon: false,
            isLessThanZero: '#7963b6',

            monthNames : ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ],
        }
    }

    componentDidMount(){

       
        this.setState({
            hours: (this.state.hours <10?'0':'') + this.state.hours,
            minutes: (this.state.minutes <10?'0':'') + this.state.minutes
            
        })        
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
   
    _handleDatePicked = (date) => {
      

      console.log('Time has been picked: ', date.getMonth());
      this.setState({
          pickedDate: date ,
          hours: ((date.getHours()) < 10? '0': '') + date.getHours(),
          minutes: ((date.getMinutes()) < 10? '0': '') + date.getMinutes()
      })

      this._hideDateTimePicker();
    };

    decreasePassengersNumber() {
      this.setState({
          passengersNumber: this.state.passengersNumber - 1
      })

      if(this.state.passengersNumber <= 1)
      {
          this.setState({
              isDisabledMinusIcon: true,
              isLessThanZero: '#e0e0d1'
          })
      }
      console.log('number ',this.state.passengersNumber - 1)

  }

  increasePassengersNumber() {
      this.setState({
          passengersNumber: this.state.passengersNumber + 1
      })
      if(this.state.passengersNumber > -1){
          this.setState({
              isDisabledMinusIcon: false,
              isLessThanZero: '#7963b6'
          })
      }
  }

    async saveOfferedRideTimeAndPassengersNumber() {

      try {
        console.log('picked date time : ', this.state.pickedDate)
        console.log('picked date time : JSON ', JSON.stringify(this.state.pickedDate))
        await AsyncStorage.setItem('offered_ride_date_time', JSON.stringify(this.state.pickedDate))
        await AsyncStorage.setItem('passengers_number', JSON.stringify(this.state.passengersNumber))

        console.log('Price Screen')
        this.props.navigation.navigate('PriceAndAboutRide')
        
      } catch (error) {
        console.log('Error in AsyncStorage ', error)
      }
    }


  render() {

    const minusIcon = <Icon name = "minus" size = {60} color = {this.state.isLessThanZero}
                    onPress = {() =>
                    {console.log('PassengersNumber decresed')
                    }}
                    />

    const plusIcon = <Icon name = "plus" size = {60}
                    color = "#7963b6"
                    onPress = {() =>
                            {console.log('PassengersNumber increased')
                            this.increasePassengersNumber()}}
                    /> 


    return (
        <View style = {styles.container}>
            <Text style = {styles.goingTime}>When are you going?</Text>


            <TouchableOpacity style = {styles.showTimePicker}
                onPress={this._showDateTimePicker}>
                <Text 
                    style = {{
                        color: '#054752',
                        fontWeight: 'bold',
                        fontSize: 23,
                        fontFamily: "sans-serif-condensed",
                        }}>{this.state.pickedDate.getDate()} {this.state.monthNames[this.state.pickedDate.getMonth()]}
                        </Text>

                  <Text 
                        style = {{
                            color: '#054752',
                            fontWeight: 'bold',
                            fontSize: 23,
                            fontFamily: "sans-serif-condensed",
                            }}>{this.state.hours}:{this.state.minutes}
                        </Text>        

                <Icon2 name = "ios-arrow-down" size = {20} color = "#7963b6"
                                            style = {{ position: 'absolute',
                                                        right: 30,}}
                                            />        
            </TouchableOpacity>

            <DateTimePicker
                mode = 'datetime'
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
            />

            <View style = {{marginTop: 50}}>
                <Text style = {styles.howManyPassengers}>So how many CarPool passengers can you take?</Text>
                    <View style = {styles.passengerNo}>
                        <Button  
                            mode="text"
                            disabled = {this.state.isDisabledMinusIcon}
                            onPress = {() => {this.decreasePassengersNumber()}}> {minusIcon}
                        </Button>

                        <Text style = {{
                                      color: '#054752',
                                      fontWeight: 'bold',
                                      fontSize: 70,
                                      fontFamily: "sans-serif-condensed",}}>{this.state.passengersNumber}</Text>

                        <Button  
                              mode="text"
                              onPress = {() => {this.increasePassengersNumber()}}> {plusIcon}
                        </Button>                    
                    </View>

            </View>

            <Icon2 name = "ios-arrow-dropright-circle" size = {50} color = "#7963b6"
                                        style = {{position: 'absolute',
                                        bottom:20,
                                        right:20,}}
                                        onPress = {() =>
                                        {this.saveOfferedRideTimeAndPassengersNumber()}}
                                        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 30,
  },

  goingTime: {
    fontWeight: 'bold',
    fontFamily: "sans-serif-medium",
    fontSize: 30,
    fontWeight: 'bold',
    color: '#054752',
    marginLeft: 30,
  },

  showTimePicker: {
    borderRadius: 40,
    width: '80%',
    height: 80,
    backgroundColor: "#fff",
    marginTop: 50,
    marginLeft: '10%',
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center' ,
    borderWidth: 1,
    borderColor: 'grey',

  },

  howManyPassengers: {
    fontWeight: 'bold',
    fontFamily: "sans-serif-medium",
    fontSize: 30,
    fontWeight: 'bold',
    color: '#054752',
    marginLeft: 30,
  },

  passengerNo: {
      marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
  }

})
