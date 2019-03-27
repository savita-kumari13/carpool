import React, { Component } from 'react'
import { 
    Text,
    View,
    TouchableOpacity ,
    StyleSheet,
} from 'react-native'

import { TextInput, Button,} from 'react-native-paper';

import DateTimePicker from 'react-native-modal-datetime-picker';

import Icon from 'react-native-vector-icons/Ionicons'

export default class Time extends Component {

    constructor(props){
        super(props)

        this.state = {
            isDateTimePickerVisible: false,
            hours : new Date().getHours(),
            minutes : new Date().getMinutes()
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
      console.log('A date has been picked: ', date);
      this.setState({
          hours: ((date.getHours()) < 10? '0': '') + date.getHours(),
          minutes: ((date.getMinutes()) < 10? '0': '') + date.getMinutes()
      })
      this._hideDateTimePicker();
    };


  render() {
    return (
        <View style = {styles.container}>
            <Text style = {styles.goingTime}>What time will you pick passengers up?</Text>


            <TouchableOpacity style = {styles.showTimePicker}
                onPress={this._showDateTimePicker}>
                <Text 
                    style = {{
                        color: '#054752',
                        fontWeight: 'bold',
                        fontSize: 40,
                        fontFamily: "sans-serif-condensed",
                        }}>{this.state.hours} : {this.state.minutes}</Text>

                <Icon name = "ios-arrow-down" size = {20} color = "#7963b6"
                                            style = {{ position: 'absolute',
                                                        right: 30,}}
                                            />        
            </TouchableOpacity>

            <DateTimePicker
                mode = 'time'
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
            />

            <Icon name = "ios-arrow-dropright-circle" size = {50} color = "#7963b6"
                                        style = {{position: 'absolute',
                                        bottom:20,
                                        right:20,}}
                                        onPress = {() =>
                                        {console.log('PassengersNumber Screen')
                                        this.props.navigation.navigate('PassengersNumber')}}
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
    marginLeft: 20,
  },

  showTimePicker: {
    borderRadius: 40,
    width: '80%',
    height: 80,
    backgroundColor: "#fff",
    marginTop: 50,
    marginLeft: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center' ,
    borderWidth: 1,
    borderColor: 'grey',

  },

})
