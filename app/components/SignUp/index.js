import React, { Component } from 'react'
import firebase from 'react-native-firebase';
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../axios'
import { SocialIcon } from 'react-native-elements'
import NavigationService from '../../../NavigationService'
import CountryPicker from 'react-native-country-picker-modal';
import config from '../../config/constants'

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ToastAndroid,
    Alert,
    Image,
    TouchableHighlight,
    BackHandler,
    ScrollView,
    ActivityIndicator,
} from 'react-native'

export default class SignUp extends Component {

  constructor(props)
  {
    super(props);
    this.handleBackPress = this.handleBackPress.bind(this);

    this.state =
    { 
      name: '',
      email: '', 
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      enterCode: false,
      country: {
        cca2: 'IN',
        callingCode: '91'
      },

      errors: {
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
      },

      errorNameShow: false,
      errorEmailShow: false,
      errorPasswordShow: false,
      errorConfirmPasswordShow: false,
      errorPhoneNumberShow: false,

      errorNameBorderFocused: false,
      errorEmailBorderFocused: false,
      errorPasswordBorderFocused: false,
      errorConfirmPasswordBorderFocused: false,
      errorPhoneNumberBorderFocused: false,

      isEmailFocused: false,
      isPasswordFocused: false,
      isConfirmPasswordFocused: false,
      isNameFocused: false,
      isPhoneFocused: false,
      isSigningUp: false,
      isFbLoging: false,
    };
  }


  componentDidMount()
  {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      // Process your token as required
      console.log('new device token ', fcmToken)
      const data = {
        name: this.state.name,
        device_token: fcmToken
      }
      axios.post('/users/save_device_token', data)
      .then(res => {

      })
      .catch(err => {

      })
  });
  }

  componentWillUnmount()
  {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.onTokenRefreshListener();
  }

  handleBackPress = () =>
  {
    NavigationService.navigate('Login', {})
    return true;
  }

  handleSignUp = async() =>
  {
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
    console.log('device token ', device_token)
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      confirm_password: this.state.confirmPassword,
      phone_number: this.state.phoneNumber,
      device_token: device_token
    }
    this.setState({
      isSigningUp: true
    })
  await axios.post(`/users/register`, user)
  .then(res => {
    let resData=res.data;
      if(!resData.status)
      {
        if(resData.response.hasOwnProperty('errors'))
        {
          if(resData.response.errors.hasOwnProperty('name')){
            this.setState({
              errorNameShow: true,
              errorNameBorderFocused: true,
            })
          }
          if(resData.response.errors.hasOwnProperty('email')){
            this.setState({
              errorEmailShow: true,
              isEmailFocused: false,
              errorEmailBorderFocused: true,
            })
          }
          if(resData.response.errors.hasOwnProperty('password')){
            this.setState({
              errorPasswordShow: true,
              errorPasswordBorderFocused: true,
            })
          }
          if(resData.response.errors.hasOwnProperty('confirm_password')){
            this.setState({
              errorConfirmPasswordShow: true,
              errorConfirmPasswordBorderFocused: true,
            })
          }

          if(resData.response.errors.hasOwnProperty('phone_number')){
            this.setState({
              errorPhoneNumberShow: true,
              errorPhoneNumberBorderFocused: true,
            })
          }

        this.setState({
          errors: {
            name: resData.response.errors.name,
            email: resData.response.errors.email,
            password: resData.response.errors.password,
            confirmPassword: resData.response.errors.confirm_password,
            phone_number: resData.response.errors.phone_number
          }
        })
        throw new Error(Object.values(resData.response.errors).join(', '));
        }
      else{
        ToastAndroid.show(resData.messages.join(', '),ToastAndroid.TOP, ToastAndroid.SHORT);
      }       
    }
    else
    {
      this.setState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
      });
      NavigationService.navigate('MainContainer', {})
    }
    this.setState({
      isSigningUp: false
    })
  })
  .catch(err => {
    console.log('error sending post request',err.message)
    this.setState({
      isSigningUp: false
    })
    ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
  })
}

  handleFacebookLogin = async () => {
    AccessToken.getCurrentAccessToken().then(() =>
    {
      LoginManager.logInWithReadPermissions(['public_profile', 'email']).then((result) =>
        {
          if (result.isCancelled)
          {
            return Promise.reject(new Error('The user cancelled the request'));
          }
          // Retrieve the access token
          return AccessToken.getCurrentAccessToken();
        }).then((data) =>
        {
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
          return firebase.auth().signInWithCredential(credential).then((user) =>
          {
            if(user.additionalUserInfo.isNewUser)
            {
              this.registerFacebookUser(user);                                       
            }
            else
            {
              this.loginFacebookUser(user)
            }
          })                                                                       
        }).catch((error) => {
          console.log('error.', error)
          ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
        })
    })
    .catch((error) => {
      console.log('error ....', error)
      ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
    });
  }


  async registerFacebookUser(user) {
    this.setState({
      isFbLoging: true
    })
    try {
      const fbName = user.additionalUserInfo.profile.first_name + ' '+ user.additionalUserInfo.profile.last_name
      await AsyncStorage.setItem('fbName', JSON.stringify(fbName))
      await AsyncStorage.setItem('fbEmail', JSON.stringify(user.additionalUserInfo.profile.email))
      await AsyncStorage.setItem('fbAvatar', JSON.stringify(user.user._user.photoURL))
      NavigationService.navigate('PhoneAuth', {})
      this.setState({
        isFbLoging: false
      })
    } catch (error) {
      this.setState({
        isFbLoging: false
      })
      console.log(error)
      ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
    }
  }

  async loginFacebookUser(user) {
    this.setState({
      isFbLoging: true
    })
    const fbName = user.additionalUserInfo.profile.first_name + ' '+ user.additionalUserInfo.profile.last_name
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
    await axios.post(`/users/facebook/login`, {
      name: fbName,
      email: user.additionalUserInfo.profile.email,
      phone_number: user.user._user.phoneNumber,
      avatar: user.additionalUserInfo.profile.picture.data.url,
      device_token: device_token
    })
    .then(res => {
      if(res.data.status){
        this.setState({
          email: '',
          password: '',
          isFbLoging: false
        });
        NavigationService.navigate('MainContainer', {})
      }
      else{
        this.setState({
          isFbLoging: false
        })
        ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
      }
    })
    .catch(err => {
      this.setState({
        isFbLoging: false
      })
      console.log('error sending post request',err.message)
      ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
    })
  }

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


    handleNameFocus = () => this.setState({isNameFocused: true, errorNameBorderFocused: false})
    handleNameBlur = () => this.setState({isNameFocused: false, errorNameBorderFocused: false})

    handleEmailFocus = () => this.setState({isEmailFocused: true, errorEmailBorderFocused: false})
    handleEmailBlur = () => this.setState({isEmailFocused: false, errorEmailBorderFocused: false})

    handlePasswordFocus = () => this.setState({isPasswordFocused: true, errorPasswordBorderFocused: false})
    handlePasswordBlur = () => this.setState({isPasswordFocused: false, errorPasswordBorderFocused: false})

    handleConfirmPasswordFocus = () => this.setState({isConfirmPasswordFocused: true, errorConfirmPasswordBorderFocused: false})
    handleConfirmPasswordBlur = () => this.setState({isConfirmPasswordFocused: false, errorConfirmPasswordBorderFocused: false})

    handlePhoneFocus = () => this.setState({isPhoneFocused: true, errorPhoneNumberBorderFocused: false})
    handlePhoneBlur = () => this.setState({isPhoneFocused: false,errorPhoneNumberBorderFocused: false})

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput 
            onFocus={this.handleNameFocus}
            onBlur={this.handleNameBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isNameFocused? config.COLOR: this.state.errorNameBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isNameFocused? 2: 1,}]}
            placeholder="Name"
            selectionColor={config.COLOR}
            onChangeText={name => this.setState({name: name, errorNameShow: false, errorNameBorderFocused: false})}
            value={this.state.name}/>
        </View>  
              
        {this.state.errorNameShow && 
        <Text style={{ color: 'red', marginHorizontal: 25  }}>
          {this.state.errors.name}
        </Text>}

      <View style={styles.inputContainer}>
        <TextInput
            onFocus={this.handleEmailFocus}
            onBlur={this.handleEmailBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isEmailFocused? config.COLOR: this.state.errorEmailBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isEmailFocused? 2: 1,}]}
            placeholder="Email"
            selectionColor={config.COLOR}
            keyboardType="email-address"
            onChangeText={email => this.setState({email: email, errorEmailShow: false, errorEmailBorderFocused: false})}
            value={this.state.email}/>
      </View>       

      {this.state.errorEmailShow && 
      <Text style={{ color: 'red', marginHorizontal: 25  }}>
        {this.state.errors.email}
      </Text>} 

      <View style={styles.inputContainer}>
        <TextInput
            onFocus={this.handlePasswordFocus}
            onBlur={this.handlePasswordBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isPasswordFocused? config.COLOR: this.state.errorPasswordBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isPasswordFocused? 2: 1,}]}
            placeholder="Password"
            selectionColor={config.COLOR}
            secureTextEntry={true}
            onChangeText={password => this.setState({password: password, errorPasswordShow: false, errorPasswordBorderFocused: false})}
            value={this.state.password}/>
      </View>

      {this.state.errorPasswordShow &&
      <Text style={{ color: 'red', marginHorizontal: 25  }}>
        {this.state.errors.password}
      </Text>}

      <View style={styles.inputContainer}>
        <TextInput 
          onFocus={this.handleConfirmPasswordFocus}
          onBlur={this.handleConfirmPasswordBlur}
          style={[styles.inputs, 
            {borderBottomColor: (this.state.isConfirmPasswordFocused? config.COLOR: this.state.errorConfirmPasswordBorderFocused? 'red': '#000'),
            borderBottomWidth: this.state.isConfirmPasswordFocused? 2: 1,}]}
          onChangeText={confirmPassword => this.setState({ confirmPassword: confirmPassword, errorConfirmPasswordShow: false, errorConfirmPasswordBorderFocused: false })}
          placeholder={'Confirm password '}
          secureTextEntry={true}
          selectionColor={config.COLOR}
          value={this.state.confirmPassword}/>
      </View>

      {this.state.errorConfirmPasswordShow &&
      <Text style={{ color: 'red', marginHorizontal: 25  }}>
        {this.state.errors.confirmPassword}
      </Text>}

      <View style={styles.inputContainer}>
        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 18 }}>
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
      </View>

      {this.state.errorPhoneNumberShow &&
      <Text style={{ color: 'red', marginHorizontal: 25  }}>
        {this.state.errors.phone_number}
      </Text>}

      <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 30 }}>
        <Button 
          style={styles.registerButton}
          onPress={this.handleSignUp}
          mode = "contained"
          loading = {this.state.isSigningUp}>
          <Text style = {{color: '#fff', fontWeight: 'bold' }}>SIGN UP</Text>
        </Button>
      </View>    

      <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 0 }}>
        <Button 
          style={[styles.loginButton]}
          mode = 'text'
          onPress = {() => this.props.navigation.navigate('Login') }>
            <Text style = {{color: config.COLOR, fontWeight: 'bold' }}> ALREADY A MEMBER? LOG IN</Text>
        </Button>
      </View>

      <View style = {{flexDirection: "row", justifyContent: 'center',}}>
        <View style={{
              marginTop: 7,
              borderBottomColor: '#cccccc',
              height: 1,
              width: 120,
              marginLeft: 10,
              borderBottomWidth: 1,
              backgroundColor: '#cccccc'
          }}/>
        <Text style = {{fontWeight : 'bold' ,color: '#000', marginLeft: 10,}}>OR</Text>
        <View style={{
            marginTop: 7,
            borderBottomColor: '#cccccc',
            height: 1,
            width: 120,
            marginLeft: 10,
            borderBottomWidth: 1,
            backgroundColor: '#cccccc'
        }}/>
      </View>
      <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 10 }}>
        <SocialIcon
          title='Sign In With Facebook'
          button
          type='facebook'
          fontWeight = 'bold'
          onPress = {this.handleFacebookLogin}
          style = {styles.fbButton}
          /> 
        {this.state.isFbLoging && <ActivityIndicator size="large" />}
      </View>
    </ScrollView>
    )
  }
    }
    
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 70,

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

  textInput: {
    borderBottomWidth: 2,
    padding: 0,
    flex: 1,
    fontSize: 16,
    color: config.TEXT_COLOR,
    fontWeight: 'bold'
  },

  inputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    height:45,
    marginBottom:10,
    marginHorizontal: 10,
    marginRight: 20,
    flexDirection: 'row',
    alignItems:'center'
},
loginRegister:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10
},
inputs:{
    height:45,
    marginLeft:16,
    padding: 0,
    flex: 1,
    fontSize: 16,
    color: config.TEXT_COLOR,
    fontWeight: 'bold'
},
inputIcon:{
  width:20,
  height:20,
  justifyContent: 'center'
},


registerButton:{
  borderRadius: 30,
  width: 280,
  height: 40,
  backgroundColor: config.COLOR,
  justifyContent: 'center',
},

registerText:{
  color:'#fff',
  textAlign:'center',
},


loginButton: {
borderRadius: 30,
width: 280,
height: 40,
backgroundColor: "#fff",
marginTop: 10,
justifyContent: 'center'
},

fbButton:{
height: 40,
width: 280,
marginTop: 10,
borderRadius: 30,
justifyContent: 'center',
alignItems: 'center',
},

})

  
    