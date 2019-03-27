import React, { Component } from 'react'
import { 
    Text, 
    View,
    StyleSheet,
 } from 'react-native'

 import { TextInput, Button,} from 'react-native-paper';

export default class AboutRide extends Component {

    constructor(props){
        super(props)

        this.state = {
            aboutText: ''
        }
    }


  render() {
    return (
        <View style = {styles.container}>
            <Text style = {styles.aboutRideText}>Anything to add about your ride?</Text>

            <TextInput
                mode = 'outlined(disabled)'
                multiline = {true}
                numberOfLines = {6}
                style = {styles.aboutTextInput}
                value = {this.state.aboutText}
                placeholderTextColor = '#cccc99'
                placeholder = "Hello! I'm going to visit my family. I travel with a dog and I have a lot of space in the boot!"
                onChangeText = {(aboutText) => {this.setState({aboutText})}}
            ></TextInput>

        <Button mode = "contained" style = {styles.postRide}
                        onPress = {() => {this.props.navigation.navigate('Current')}}>
                        <Text style = {{color: '#fff', fontWeight: 'bold' }}>Post ride</Text>

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

      aboutRideText: {
        fontWeight: 'bold',
        fontFamily: "sans-serif-medium",
        fontSize: 30,
        fontWeight: 'bold',
        color: '#054752',
        marginLeft: 30,
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
