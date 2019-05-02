import React, { Component } from 'react'
import firebase from 'react-native-firebase';
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import axios from '../axios'
import { SocialIcon } from 'react-native-elements'
import NavigationService from '../../../NavigationService'

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    //Button,
    Image,
    TouchableHighlight,
    BackHandler,
    ScrollView,
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
      phoneNumber: '+91',

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

      errorNameBorderFocused: false,
      errorEmailBorderFocused: false,
      errorPasswordBorderFocused: false,
      errorConfirmPasswordBorderFocused: false,

      isEmailFocused: false,
      isPasswordFocused: false,
      isConfirmPasswordFocused: false,
      isNameFocused: false,
      isPhoneFocused: false,
    };
  }


  static navigationOptions = {

    title: 'Sign up',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#fff',
    },
    headerStyle: {
      backgroundColor: '#7963b6'
    },
    headerLeft: null,
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
      NavigationService.navigate('Login', {})
      return true;
      // BackHandler.exitApp();
    }

    handleSignUp = async() =>
    { 
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirm_password: this.state.confirmPassword,
        phone_number: this.state.phoneNumber

      }
    await axios.post(`/users/register`, user)
    .then(res => {
      console.log('res ', res)
      let resData=res.data;
        if(!resData.status)
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

        this.setState({
          errors: {
            name: resData.response.errors.name,
            email: resData.response.errors.email,
            password: resData.response.errors.password,
            confirmPassword: resData.response.errors.confirm_password,
          }
        })
        throw new Error(Object.values(resData.response.errors).join(', '));
      }
      else
      {
        this.setState({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phoneNumber: ''
        });
        NavigationService.navigate('MainContainer', {})
      }
      
    })
    .catch(err => {
      console.log('error sending post request',err.message)
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
        }).catch((error) => 
        {
          console.log('error.', error)
        })
    }).catch((error) => {
          console.log('error ....', error)
        });
  }


  async registerFacebookUser(user) {
    console.log("new facebook user : ", user)
    const fbName = user.additionalUserInfo.profile.first_name + ' '+ user.additionalUserInfo.profile.last_name
    await axios.post(`/users/facebook/register`, {
      name: fbName,
      email: user.additionalUserInfo.profile.email,
      phone_number: '',
      // profile_picture: user._user.photoURL
    }).then(res => {
      console.log('res : ', res)
      this.setState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
      });
      console.log('navigating to main container....')
      NavigationService.navigate('MainContainer', {})
    }).catch(err => {
      console.log('error sending post request',err.message)
    })
  }

  async loginFacebookUser(user) {
    console.log('logging in facebook user')
    const fbName = user.additionalUserInfo.profile.first_name + ' '+ user.additionalUserInfo.profile.last_name
    await axios.post(`/users/facebook/login`, {
      name: fbName,
      email: user.additionalUserInfo.profile.email,
      phone_number: '',
      // profile_picture: user._user.photoURL
    }).then(res => {
      console.log('res : ', res)
      this.setState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
      });
      console.log('navigating to main container....')
      NavigationService.navigate('MainContainer', {})
    }).catch(err => {
      console.log('error sending post request',err.message)
    })
  }


    handleNameFocus = () => this.setState({isNameFocused: true, errorNameBorderFocused: false})
    handleNameBlur = () => this.setState({isNameFocused: false, errorNameBorderFocused: false})

    handleEmailFocus = () => this.setState({isEmailFocused: true, errorEmailBorderFocused: false})
    handleEmailBlur = () => this.setState({isEmailFocused: false, errorEmailBorderFocused: false})

    handlePasswordFocus = () => this.setState({isPasswordFocused: true, errorPasswordBorderFocused: false})
    handlePasswordBlur = () => this.setState({isPasswordFocused: false, errorPasswordBorderFocused: false})

    handleConfirmPasswordFocus = () => this.setState({isConfirmPasswordFocused: true, errorConfirmPasswordBorderFocused: false})
    handleConfirmPasswordBlur = () => this.setState({isConfirmPasswordFocused: false, errorConfirmPasswordBorderFocused: false})

    handlePhoneFocus = () => this.setState({isPhoneFocused: true})
    handlePhoneBlur = () => this.setState({isPhoneFocused: false})

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput 
            onFocus={this.handleNameFocus}
            onBlur={this.handleNameBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isNameFocused? '#7963b6': this.state.errorNameBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isNameFocused? 2: 1,}]}
            placeholder="Name"
            onChangeText={name => this.setState({name: name, errorNameShow: false, errorNameBorderFocused: false})}
            value={this.state.name}/>
        </View>  
              
        {this.state.errorNameShow && 
        <Text style={{ color: 'red', marginHorizontal: 20  }}>
          {this.state.errors.name}
        </Text>}

      <View style={styles.inputContainer}>
        <TextInput
            onFocus={this.handleEmailFocus}
            onBlur={this.handleEmailBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isEmailFocused? '#7963b6': this.state.errorEmailBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isEmailFocused? 2: 1,}]}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={email => this.setState({email: email, errorEmailShow: false, errorEmailBorderFocused: false})}
            value={this.state.email}/>
      </View>       

      {this.state.errorEmailShow && 
      <Text style={{ color: 'red', marginHorizontal: 20  }}>
        {this.state.errors.email}
      </Text>} 

      <View style={styles.inputContainer}>
        <TextInput
            onFocus={this.handlePasswordFocus}
            onBlur={this.handlePasswordBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isPasswordFocused? '#7963b6': this.state.errorPasswordBorderFocused? 'red': '#000'),
              borderBottomWidth: this.state.isPasswordFocused? 2: 1,}]}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={password => this.setState({password: password, errorPasswordShow: false, errorPasswordBorderFocused: false})}
            value={this.state.password}/>
      </View>

      {this.state.errorPasswordShow &&
      <Text style={{ color: 'red', marginHorizontal: 20  }}>
        {this.state.errors.password}
      </Text>}

      <View style={styles.inputContainer}>
        <TextInput 
          onFocus={this.handleConfirmPasswordFocus}
          onBlur={this.handleConfirmPasswordBlur}
          style={[styles.inputs, 
            {borderBottomColor: (this.state.isConfirmPasswordFocused? '#7963b6': this.state.errorConfirmPasswordBorderFocused? 'red': '#000'),
            borderBottomWidth: this.state.isConfirmPasswordFocused? 2: 1,}]}
          onChangeText={confirmPassword => this.setState({ confirmPassword: confirmPassword, errorConfirmPasswordShow: false, errorConfirmPasswordBorderFocused: false })}
          placeholder={'Confirm password '}
          secureTextEntry={true}
          value={this.state.confirmPassword}/>
      </View>

      {this.state.errorConfirmPasswordShow &&
      <Text style={{ color: 'red', marginHorizontal: 20  }}>
        {this.state.errors.confirmPassword}
      </Text>}

      <View style={styles.inputContainer}>
        <TextInput
          onFocus={this.handlePhoneFocus}
          onBlur={this.handlePhoneBlur}
          style={[styles.inputs, 
            {borderBottomColor: this.state.isPhoneFocused? '#7963b6': '#000',
            borderBottomWidth: this.state.isPhoneFocused? 2: 1,}]}
          onChangeText={phoneNumber => this.setState({ phoneNumber })}
          placeholder={'Phone number '}
          value={this.state.phoneNumber}
          keyboardType = "phone-pad"/>
      </View>

      <View style = {styles.buttonContainer}>
        <Button 
          style={[styles.registerButton]}
          onPress={this.handleSignUp}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }} >SIGN UP</Text>
        </Button>    

        <Button 
          style={[styles.loginButton]}
          mode = 'text'
          onPress = {() => this.props.navigation.navigate('login') }>
            <Text style = {{color: '#7963b6', fontWeight: 'bold' }}> ALREADY A MEMBER? LOG IN</Text>
        </Button>

      <Text style = {{fontWeight : 'bold' ,color: '#000', marginHorizontal: 170}}>OR</Text>

        <SocialIcon
            title='Sign In With Facebook'
            button
            type='facebook'
            fontWeight = 'bold'
            onPress = {this.handleFacebookLogin}
            style = {styles.fbButton}
          /> 
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
    paddingTop: 150,

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
    borderBottomWidth: 2,
    flex:1,
},
inputIcon:{
  width:20,
  height:20,
  justifyContent: 'center'
},

buttonContainer:{
  flex: 1,
  alignItems: 'center',
  marginTop: 20,
},

registerButton:{

  borderRadius: 30,
  width: 300,
  height: 40,
  backgroundColor: "#7963b6",
  justifyContent: 'center',

},

registerText:{
  color:'#fff',
  textAlign:'center',
},


loginButton: {
borderRadius: 30,
width: 300,
height: 40,
backgroundColor: "#fff",
marginTop: 10,
justifyContent: 'center'
},

fbButton:{
height: 40,
width: 270,
marginTop: 10,
borderRadius: 30,
justifyContent: 'center',
alignItems: 'center',
},

})

  
    