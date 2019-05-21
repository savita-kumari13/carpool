import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    BackHandler,
    Alert,
    ScrollView,
    Linking,
    ToastAndroid
} from 'react-native'
import { Button } from 'react-native-paper'
import axios from './axios'
import config from '../config/constants'

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
        email: ''
    }
    this.handleBackPress = this.handleBackPress.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount()
  {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = () =>
  {
    // NavigationService.navigate('Login', {})
    this.props.navigation.navigate('Login')
    return true;
  }

  forgotPassword(){
    axios.post('/forgot_password', {
      email: this.state.email
    })
    .then(res => {
      if(res.data.status){
        ToastAndroid.show("We've sent you a link to change your password", ToastAndroid.LONG)
      }
      else{
        ToastAndroid.show(res.data.messages.join(', '),ToastAndroid.TOP, ToastAndroid.SHORT);
      }
    })
    .catch(err => {
      ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
      console.log('error sending forgot password request ', err)
    })
  }
    
  render() {
    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <Text style = {{fontWeight: 'bold',
                fontSize: 14,
                color: config.TEXT_COLOR,}}>Please enter the email you signed up with. We will send you a link to change your password</Text>
            <TextInput
                autoFocus
                style={{ height: 40, marginTop: 30, marginBottom: 15, borderBottomWidth: 2, borderBottomColor: config.COLOR, fontSize: 16,
                  color: config.TEXT_COLOR,
                  fontWeight: 'bold' }}
                placeholder={'Email'}
                selectionColor={config.COLOR}
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
        backgroundColor: config.COLOR,
        justifyContent: 'center',
      
      },
})
