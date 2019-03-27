import React, { Component } from 'react'
import { 
    Text, 
    View,
    StyleSheet, 
} from 'react-native'

import { TextInput, Button,} from 'react-native-paper';

import Icon from 'react-native-vector-icons/EvilIcons'

export default class Price extends Component {

    constructor(props){
        super(props)

        this.state = {
            price : 50,
            isDisabledMinusIcon: false,
            isLessThanZero: '#7963b6',
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
        <View style = {styles.container}>
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

            <Button mode = "contained" style = {styles.confirmRide}
                onPress = {() => {this.props.navigation.navigate('AboutRide')
                console.log('ABoutRide Screen')}}>
                <Text style = {{color: '#fff', fontWeight: 'bold' }}>CONTINUE</Text>

          </Button>


        </View>        
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

      editPrice: {
        borderRadius: 40,
        width: '80%',
        height: 60,
        backgroundColor: "#fff",
        marginTop: 50,
        marginLeft: '10%',
        justifyContent: 'center',
        alignItems: 'center' ,
        borderWidth: 1,
        borderColor: 'grey',
        fontSize: 80,
      },

      displayPrice: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      },

      confirmRide: {
        borderRadius: 30,
        width: 300,
        height: 50,
        backgroundColor: "#7963b6",
        justifyContent: 'center',
        marginTop: 50,
        marginLeft:30,
      }
    })
