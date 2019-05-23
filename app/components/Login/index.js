import React, { Component } from 'react'
import firebase from 'react-native-firebase';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import { SocialIcon } from 'react-native-elements'
import axios from '../axios'
import NavigationService from '../../../NavigationService';
import config from '../../config/constants'

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    BackHandler,
    Alert,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
    Image,
} from 'react-native'


export default class Login extends Component {

  static navigationOptions = {
        header: null
    }

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      email: '',
      password: '',
      passwordResetCode: '',

      errors: {
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
      },
      
      errorEmailShow: false,
      errorPasswordShow: false,

      errorEmailBorderFocused: false,
      errorPasswordBorderFocused: false,

      isEmailFocused: false,
      isPasswordFocused: false,
      isLoging: false,
      isFbLoging: false,
    };

    this.handleBackPress = this.handleBackPress.bind(this);
  }

  componentDidMount()
  {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount()
  {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () =>
  {
     BackHandler.exitApp();
  }


  handleLogin = async() =>  {
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
    })
    const user = {
      email: this.state.email,
      password: this.state.password,
      device_token: device_token
  }
  this.setState({
    isLoging: true
  })
  await axios.post(`/users/login`, user)
  .then(res => {
    console.log(res.data)
    let resData=res.data;
    if(!resData.status)
    {
      if(resData.response.hasOwnProperty('errors'))
      {
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
  
        this.setState({
          errors: {
            email: resData.response.errors.email,
            password: resData.response.errors.password,
          }
        })
        throw new Error(Object.values(resData.response.errors).join(', '));
      }
    else{
      console.log('error', resData.messages)
      ToastAndroid.show(resData.messages.join(', '),ToastAndroid.TOP, ToastAndroid.SHORT);
    }
  }
    else
    {
      this.setState({
        email: '',
        password: ''
      });
      NavigationService.navigate('MainContainer', {})
    }
    this.setState({
      isLoging: false
    })
  })
  .catch(err => {
    console.log('error sending post request',err.message)
    this.setState({
      isLoging: false
    })
    ToastAndroid.show('Unknown error occurred',ToastAndroid.TOP, ToastAndroid.SHORT)
  })
}

  handleFacebookLogin = async () => {
    AccessToken.getCurrentAccessToken().then(() =>
    {
      LoginManager.logInWithReadPermissions(['public_profile', 'email']).then((result) =>
        {
          console.log('result ', result)
          if (result.isCancelled)
          {
            return Promise.reject(new Error('The user cancelled the request'));
          }
          // Retrieve the access token
          return AccessToken.getCurrentAccessToken();
        }).then((data) =>
        {
          console.log('data : ', data)
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
          console.log('error &&&', error)
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
      avatar: user.user._user.photoURL,
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

 
handleEmailFocus = () => this.setState({isEmailFocused: true})

handleEmailBlur = () => this.setState({isEmailFocused: false})

handlePasswordFocus = () => this.setState({isPasswordFocused: true})

handlePasswordBlur = () => this.setState({isPasswordFocused: false})
  

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style = {{alignItems: 'center', marginBottom:50,}}>
          <Image style={styles.logo} source={{uri: config.API_HOST + '/carpool_logo.png' }}/>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            onFocus={this.handleEmailFocus}
            onBlur={this.handleEmailBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isEmailFocused? config.COLOR: this.state.errorEmailBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isEmailFocused? 2: 1,}]}
            placeholder="E-mail"
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
            secureTextEntry={true}
            onChangeText={password => this.setState({password: password, errorPasswordShow: false, errorPasswordBorderFocused: false})}
            value={this.state.password}/>
        </View>

        {this.state.errorPasswordShow && 
        <Text style={{ color: 'red', marginHorizontal: 25  }}>
          {this.state.errors.password}
        </Text>}

        <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 30 }}>
          <Button
              style={styles.loginBtn}
              onPress={this.handleLogin}
              mode = "contained"
              loading = {this.state.isLoging}>
                <Text style = {{color: '#fff', fontWeight: 'bold' }}>LOG IN</Text>
            </Button>
        </View> 

        <View style = {{alignItems: 'center',justifyContent: 'center', }}>
          <Button 
            style={[ styles.registerButton]}
            mode = 'text'
            onPress ={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style = {{color: config.COLOR, fontWeight: 'bold' }}>FORGOT YOUR PASSWORD?</Text>
          </Button>
        </View>         

        <View style = {{alignItems: 'center',justifyContent: 'center', }}>
          <Button 
            style={[ styles.registerButton]}
            mode = 'text'
            onPress ={() => NavigationService.navigate('SignUp', {})}>
              <Text style = {{color: config.COLOR, fontWeight: 'bold' }}>NOT A MEMEBER YET? JOIN FOR FREE</Text>
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
    paddingTop: 70,
  },

  logo: {
    width: 120,
    height: 100,
  },

  iconStyles : {
    borderRadius: 30,
    width: 280,
    height: 40,
    backgroundColor: "#3b5998",
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

loginBtn:{
  borderRadius: 30,
  width: 280,
  height: 40,
  backgroundColor: config.COLOR,
  justifyContent: 'center',
},

registerButton: {
  borderRadius: 30,
  width: 355,
  height: 40,
  backgroundColor: "#fff",
  marginTop: 10,
  justifyContent: 'center'

},

inputs:{
    height:45,
    marginLeft:16,
    height:45,
    marginLeft:16,
    padding: 0,
    flex: 1,
    fontSize: 16,
    color: config.TEXT_COLOR,
    fontWeight: 'bold'
},
buttonContainer:{
  // marginTop:10,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',

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
        