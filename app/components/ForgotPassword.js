import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    BackHandler,
    Alert,
    ScrollView,
    Linking
} from 'react-native'
import { Button } from 'react-native-paper'
import axios from './axios'

export default class ForgotPassword extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         email: ''
      }
    }

    forgotPassword(){
        axios.post('/forgot_password', {
            email: this.state.email
        })
        .then(res => {

        })
        .catch(err => {
            console.log('error sending forgot password request ', err)
        })
    }
    
  render() {
    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <Text style = {{fontWeight: 'bold',
                fontSize: 14,
                color: '#054752',}}>Please enter the email you signed up with. We will send you a link to change your password</Text>
            <TextInput
                autoFocus
                style={{ height: 40, marginTop: 30, marginBottom: 15, borderBottomWidth: 2, borderBottomColor: '#7963b6' }}
                placeholder={'Email'}
                keyboardType="email-address"
                onChangeText={email => this.setState({email})}
            />
            <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 40 }}>
          <Button
              style={styles.loginBtn}
              onPress={() => {this.forgotPassword()}}
              mode = "contained">
            <Text style = {{color: '#fff', fontWeight: 'bold' }}>Submit</Text>
          </Button> 
        </View> 
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingTop: 50,
      paddingHorizontal: 20
    },

    loginBtn:{
        borderRadius: 30,
        width: 250,
        height: 45,
        backgroundColor: "#7963b6",
        justifyContent: 'center',
      
      },
})
