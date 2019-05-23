import React, { Component } from 'react'
import firebase from 'react-native-firebase';
import { NavigationActions ,} from 'react-navigation'
import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Button} from 'react-native-paper';
import axios from '../axios'
import CountryPicker from 'react-native-country-picker-modal'
import NavigationService from '../../../NavigationService';
import config from '../../config/constants'

export default class PhoneAuth extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      phoneNumber: '',
      enterCode: false,
      country: {
        cca2: 'IN',
        callingCode: '91'
      },
      
      errors: {
          phoneNumber: ''
      },

      isPhoneFocused: false,
      errorPhoneNumberShow: false,
      errorPhoneNumberBorderFocused: false,
      isLoading: false
    }
  }

  handlePhoneFocus = () => this.setState({isPhoneFocused: true, errorPhoneNumberBorderFocused: false})
  handlePhoneBlur = () => this.setState({isPhoneFocused: false,errorPhoneNumberBorderFocused: false})

  _changeCountry = (country) => {
      this.setState({ country });
    }
  
  _renderCountryPicker = () => {
    if (this.state.enterCode)
      return (
        <View/>
      );
    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        translation='eng'/>
    );
  }
    
  _renderCallingCode = () => {
    if (this.state.enterCode)
      return (
        <View />
      );
    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );
  }

  async savePhoneNumber(){
    this.setState({
      isLoading: true
    })
    try {
      const fbName = JSON.parse(await AsyncStorage.getItem('fbName'))
      const fbEmail = JSON.parse(await AsyncStorage.getItem('fbEmail'))
      const fbAvatar = JSON.parse(await AsyncStorage.getItem('fbAvatar'))
      let device_token
      await firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          device_token = fcmToken
          console.log('fcm token ', fcmToken)
        } else {
          // user doesn't have a device token yet
          console.log("no token")
        } 
      });
      await axios.post(`/users/facebook/register`, {
        name: fbName,
        email: fbEmail,
        avatar: fbAvatar,
        phone_number: this.state.phoneNumber,
        device_token: device_token
      })
      .then(res => {
        let resData=res.data;
        if(!resData.status)
        {
          if(resData.response.hasOwnProperty('errors'))
          {
            if(resData.response.errors.hasOwnProperty('phone_number'))
            {
              this.setState({
              errorPhoneNumberShow: true,
              errorPhoneNumberBorderFocused: true,
              })
            }
            this.setState({
              errors: {
                  phone_number: resData.response.errors.phone_number
              }
            })
            throw new Error(Object.values(resData.response.errors).join(', '));
          }
          else{
            ToastAndroid.show(resData.messages.join(', '),ToastAndroid.TOP, ToastAndroid.SHORT);
          }
          this.setState({
            isLoading: false
          })
        }
        else{
          this.setState({
              phoneNumber: '',
              isLoading: false
          })
          this.props.navigation.navigate('MainContainer')
        }
      })
      .catch(err => {
        console.log('error sending save phone number request ', err)
        this.setState({
          isLoading: false
        })
        ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
      })
  }catch(error){
    this.setState({
      isLoading: false
    })
    console.log('error in async storage ', error)
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  }
}
    
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: 'row', marginTop: 30 }}>
            {this._renderCountryPicker()}
            {this._renderCallingCode()}
            <TextInput
            onFocus={this.handlePhoneFocus}
            onBlur={this.handlePhoneBlur}
            value={this.state.phoneNumber}
            keyboardType = "phone-pad"
            style={[styles.textInput, 
              {borderBottomColor: (this.state.isPhoneFocused? config.COLOR: this.state.errorPhoneNumberBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isPhoneFocused? 2: 1,}]}
            onChangeText={phoneNumber => this.setState({ phoneNumber: phoneNumber, errorPhoneNumberShow: false, errorPhoneNumberBorderFocused: false })}
            placeholder={'Phone number '}
            selectionColor={config.COLOR}
            maxLength={this.state.enterCode ? 6 : 20} />
        </View>
        {this.state.errorPhoneNumberShow &&
        <Text style={{ color: 'red', marginHorizontal: 50 , marginTop: 10, }}>
            {this.state.errors.phone_number}
        </Text>}
        <View style = {{alignItems: 'center'}}>
            <Button 
              style={[styles.savePhoneBtn]}
              mode = 'contained'
              onPress={() => this.savePhoneNumber()}
              loading = {this.state.isLoading}>
              <Text style = {{color: '#fff', fontWeight: 'bold' }}>SAVE</Text>
            </Button> 
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 30,
        marginTop: 40,
    },

    textInput: {
        borderBottomWidth: 2,
        padding: 0,
        flex: 1,
        fontSize: 16,
        color: config.TEXT_COLOR,
        fontWeight: 'bold'
      },
    
      callingCodeView: {
        alignItems: 'center',
        justifyContent: 'center'
      },
    
      callingCodeText: {
        fontSize: 16,
        color: config.TEXT_COLOR,
        fontWeight: 'bold',
        paddingRight: 10
      },

      savePhoneBtn: {
        marginTop: 60,
        borderRadius: 30,
        width: 200,
        height: 45,
        backgroundColor: config.COLOR,
        justifyContent: 'center',
      },
    
})
