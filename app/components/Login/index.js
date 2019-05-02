import React, { Component } from 'react'
import firebase from 'react-native-firebase';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Button } from 'react-native-paper'
// import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { SocialIcon } from 'react-native-elements'
import axios from '../axios'
import NavigationService from '../../../NavigationService';

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
      errorMessage: null,

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
    const user = {
      email: this.state.email,
      password: this.state.password,
  }
  await axios.post(`/users/login`, user)
  .then(res => {
    console.log('res : ', res)
    let resData=res.data;

    if(!resData.status)
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
          email: response.errors.email,
          password: response.errors.password,
        }
      })
      throw new Error(Object.values(response.errors).join(', '));
    }
    else
    {
      this.setState({
        email: '',
        password: ''
      });
      console.log('navigating to main container....')
      NavigationService.navigate('MainContainer', {})
    }
  })
  .catch(err => {
    console.log('error sending post request',err.message)
  })
}


  forgotPassword = () => {

    console.log('enterd in forgotPassword method')

    return (
      <View style = {{padding: 30}}>
        <Text>Enter your email</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          placeholder={'Email'}
          keyboardType="email-address"
          onChangeText={email => this.setState({email})}
          >
        </TextInput>
        <Button title="SEND PASSWORD RESET EMAIL " color="#7963b6" onPress={this.resetPasswordEmail} />
      </View>
    );
  }

  resetPasswordEmail = () => {

    const { email } = this.state
    sendPasswordResetEmail(email).then( () => {this.confirmPasswordDialog
      console.log('password reset email sent')
    }).catch(error => console.log(`password reset email error ${error}`))

  }


  confirmPasswordDialog = () => {
    return(
      <View style = {{padding: 30}}>
        <Text>Enter code </Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          placeholder={'Code'}
          onChangeText={passwordResetCode => this.setState({passwordResetCode})}
          >
        </TextInput>
        <Button title="CONFIRM CODE " color="#7963b6" onPress={this.confirmResetCode} />

      </View>
    )
  }

  confirmResetCode = () => {
    confirmPasswordReset(code, newPassword)
    .then(() =>{
      this.setState({password: newPassword})
      console.log('password reset successfully')
    }).catch(error => {
      console.log('error in confirmResetCode', error)
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

 
handleEmailFocus = () => this.setState({isEmailFocused: true})

 handleEmailBlur = () => this.setState({isEmailFocused: false})

 handlePasswordFocus = () => this.setState({isPasswordFocused: true})

 handlePasswordBlur = () => this.setState({isPasswordFocused: false})
  

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}

        <View style={styles.inputContainer}>
          <TextInput 
            onFocus={this.handleEmailFocus}
            onBlur={this.handleEmailBlur}
            style={[styles.inputs, 
              {borderBottomColor: this.state.isEmailFocused? '#7963b6': '#000',
              borderBottomWidth: this.state.isEmailFocused? 2: 1,}]}
            placeholder="E-mail"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={email => this.setState({email})}
            value={this.state.email}/>
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            onFocus={this.handlePasswordFocus}
            onBlur={this.handlePasswordBlur}
            style={[styles.inputs, 
              {borderBottomColor: this.state.isPasswordFocused? '#7963b6': '#000',
              borderBottomWidth: this.state.isPasswordFocused? 2: 1,}]}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={password => this.setState({password})}
              value={this.state.password}/>
        </View>

        <View style = {styles.buttonContainer}>
          <Button
            style={styles.loginBtn}
            onPress={this.handleLogin}
            mode = "contained">
              <Text style = {{color: '#fff', fontWeight: 'bold' }}>LOG IN</Text>
          </Button>   
  
          <Button 
            style={[ styles.registerButton]}
            mode = 'text'
            onPress ={this.forgotPassword}>
              <Text style = {{color: '#7963b6', fontWeight: 'bold' }}>FORGOT YOUR PASSWORD?</Text>
          </Button>

          <Button 
            style={[ styles.registerButton]}
            mode = 'text'
            onPress ={() => NavigationService.navigate('SignUp', {})}>
              <Text style = {{color: '#7963b6', fontWeight: 'bold' }}>NOT A MEMEBER YET? JOIN FOR FREE </Text>
          </Button>

        <Text style = {{fontWeight : 'bold' ,color: '#000'}}>OR</Text>

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
    alignItems: 'center',
    paddingTop: '50%',
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
    marginLeft: 10,
    marginRight: 20,
    flexDirection: 'row',
    alignItems:'center',
    // justifyContent: 'center'
},

loginBtn:{

  borderRadius: 30,
  width: 300,
  height: 40,
  backgroundColor: "#7963b6",
  justifyContent: 'center',

},

registerButton: {
  borderRadius: 30,
  width: 300,
  height: 40,
  backgroundColor: "#fff",
  marginTop: 10,
  justifyContent: 'center'

},

inputs:{
    height:45,
    marginLeft:16,
    flex:1,
},
buttonContainer:{
  // marginTop:10,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',

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




 {/* <Button title="Login" onPress={this.handleLogin}
        ViewComponent={require('react-native-linear-gradient').default}
        //ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: ['#FF9800', '#F44336'],
          start: [1, 0],
          end: [0.2, 0],
        }} /> */}





        