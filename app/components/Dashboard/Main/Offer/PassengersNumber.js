import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { TextInput, Button,} from 'react-native-paper';

import Icon from 'react-native-vector-icons/EvilIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'


export default class PassengersNumber extends Component {

    constructor(props){
        super(props)

        this.state = {
            number : 3,
            isVisibleMinusIcon: false,
            isLessThanZero: '#7963b6'
        }
    }

    decreasePassengersNumber() {
        this.setState({
            number: this.state.number - 1
        })

        if(this.state.number <= 1)
        {
            this.setState({
                isVisibleMinusIcon: true,
                isLessThanZero: '#e0e0d1'
            })
        }
        console.log('number ',this.state.number - 1)

    }

    increasePassengersNumber() {
        this.setState({
            number: this.state.number + 1
        })
        if(this.state.number > -2){
            this.setState({
                isVisibleMinusIcon: false,
                isLessThanZero: '#7963b6'
            })
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
            <Text style = {styles.howManyPassengers}>So how many CarPool passengers can you take?</Text>
            <View style = {styles.passengerNo}>
                <Button  
                    mode="text"
                    disabled = {this.state.isVisibleMinusIcon}
                    onPress = {() => {this.decreasePassengersNumber()}}> {minusIcon}
                </Button>

                <Text style = {{
                            color: '#054752',
                            fontWeight: 'bold',
                            fontSize: 70,
                            fontFamily: "sans-serif-condensed",}}>{this.state.number}</Text>

                <Button  
                    mode="text"
                    onPress = {() => {this.increasePassengersNumber()}}> {plusIcon}
                </Button>                    
            </View>

            <Icon2 name = "ios-arrow-dropright-circle" size = {50} color = "#7963b6"
                                        style = {{position: 'absolute',
                                        bottom:20,
                                        right:20,}}
                                        onPress = {() =>
                                        {console.log('Price Screen')
                                        this.props.navigation.navigate('Price')}}
                                        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
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
