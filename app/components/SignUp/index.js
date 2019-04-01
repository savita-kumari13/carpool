import React, { Component } from 'react'
import firebase from 'react-native-firebase';
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { Button } from 'react-native-paper'

import LinearGradient from 'react-native-linear-gradient';

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
      firstName: '',
      lastName: '',
      email: '', 
      password: '',
      phoneNumber: '+91',
      errorMessage: null,
      isEmailFocused: false,
      isPasswordFocused: false,
      isFirstNameFocused: false,
      isLastNameFocused: false,
      isPhoneFocused: false,
    };

    this.userRef = firebase.firestore().collection('users');
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
      const { currentUser } = firebase.auth()
      this.setState({ currentUser })
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    componentWillUnmount()
    {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    handleBackPress = () =>
    {
      this.props.navigation.navigate('login')
      return true;
      // BackHandler.exitApp();
    }

   


    handleSignUp = () =>
    { 
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
          console.log('user : ', user)

            this.userRef.add({
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                phone_number: this.state.phoneNumber
            })
            .then(() => {
              this.setState({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNumber: '',
              });
              console.log('user created successfully')
              this.props.navigation.navigate('mainContainer')

            })
            .catch((error) => {
              this.setState({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNumber: '',
              });

              console.error("error adding user to firestore ", error);

            })
              
            
          }).catch((error) => {
            this.setState(
                { errorMessage: error.message })
                alert('An error occured', error.message)
                console.log('error in createUserWithEmailAndPassword', error)
            })

    }



    handleEmailFocus = () => this.setState({isEmailFocused: true})
    handleEmailBlur = () => this.setState({isEmailFocused: false})

    handlePasswordFocus = () => this.setState({isPasswordFocused: true})
    handlePasswordBlur = () => this.setState({isPasswordFocused: false})

    handleFirstNameFocus = () => this.setState({isFirstNameFocused: true})
    handleFirstNameBlur = () => this.setState({isFirstNameFocused: false})

    handleLastNameFocus = () => this.setState({isLastNameFocused: true})
    handleLastNameBlur = () => this.setState({isLastNameFocused: false})

    handlePhoneFocus = () => this.setState({isPhoneFocused: true})
    handlePhoneBlur = () => this.setState({isPhoneFocused: false})

    render() {

      // let userRef = firebase.firestore().collection('users');
        return (

          <ScrollView contentContainerStyle={styles.container}>
            {this.state.errorMessage &&
              <Text style={{ color: 'red' }}>
                {this.state.errorMessage}
              </Text>}

              <View style={styles.inputContainer}>
                <TextInput 
                  onFocus={this.handleFirstNameFocus}
                  onBlur={this.handleFirstNameBlur}
                  style={[styles.inputs, 
                          {borderBottomColor: this.state.isFirstNameFocused? '#7963b6': '#000',
                          borderBottomWidth: this.state.isFirstNameFocused? 2: 1,}]}
                  placeholder="First name"
                  onChangeText={firstName => this.setState({firstName})}
                  value={this.state.firstName}/>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                  onFocus={this.handleLastNameFocus}
                  onBlur={this.handleLastNameBlur}
                  style={[styles.inputs, 
                    {borderBottomColor: this.state.isLastNameFocused? '#7963b6': '#000',
                    borderBottomWidth: this.state.isLastNameFocused? 2: 1,}]}
                  placeholder="Last name"
                  onChangeText={lastName => this.setState({lastName})}
                  value={this.state.lastName}/>
            </View>  

            <View style={styles.inputContainer}>
              <TextInput
                  onFocus={this.handleEmailFocus}
                  onBlur={this.handleEmailBlur}
                  style={[styles.inputs, 
                    {borderBottomColor: this.state.isEmailFocused? '#7963b6': '#000',
                    borderBottomWidth: this.state.isEmailFocused? 2: 1,}]}
                  placeholder="Email"
                  keyboardType="email-address"
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
                  onChangeText={password => this.setState({password})}
                  value={this.state.password}/>
          </View>

          <View style={styles.inputContainer}>
             <TextInput
               style={[styles.inputs, 
                {borderBottomColor: this.state.isFirstNameFocused? '#7963b6': '#000',
                borderBottomWidth: this.state.isFirstNameFocused? 2: 1,}]}
               onChangeText={phoneNumber => this.setState({ phoneNumber })}
               placeholder={'Phone number '}
              //  value={this.state.phoneNumber}
               keyboardType = "phone-pad"
             >
             </TextInput>
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
              </View> 


              <Text style = {{fontWeight : 'bold' ,color: '#000'}}>OR</Text>


        <View style={styles.btnstyle}>
            <LoginButton style = {styles.fbButton}
              onLoginFinished=
              {
                (error, result) =>
                {
                      if (error)
                      {
                        console.log("login has error: " + result.error);
                      } else if (result.isCancelled)
                      {
                        console.log("login is cancelled.");
                      } else
                      {
                            AccessToken.getCurrentAccessToken().then(
                              (data) =>
                              {
                                    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
                                      .then((result) =>
                                      {
                                        if (result.isCancelled)
                                        {
                                          return Promise.reject(new Error('The user cancelled the request'));
                                        }
                                        // Retrieve the access token
                                        return AccessToken.getCurrentAccessToken();
                                      })
                                      .then((data) =>
                                      {
                                          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                                          return firebase.auth().signInWithCredential(credential).then((user) =>
                                          {
                                                console.log("user : ", user)

                                                // this.userRef.where("email", "==", user.additionalUserInfo.profile.email).onSnapshot((snapshot) =>
                                                if(user.additionalUserInfo.isNewUser)
                                                {
                                                  this.userRef.add({
                                                    first_name: user.additionalUserInfo.profile.first_name,
                                                    last_name: user.additionalUserInfo.profile.last_name,
                                                    email: user.additionalUserInfo.profile.email,
                                                    password: '',
                                                    phone_number: ''
                                                  }).then(() =>
                                                  {
                                                    this.setState({
                                                      firstName: '',
                                                      lastName: '',
                                                      email: '',
                                                      phoneNumber: '',
                                                      password: ''
                                                    });
                                                  console.log('adding user data to firestore')
                      
                                                  }).catch((error) =>
                                                  {

                                                    this.setState({
                                                      firstName: '',
                                                      lastName: '',
                                                      email: '',
                                                      phoneNumber: '',
                                                      password: ''
                                                    });
                                                    console.log('error adding user to firestore -- facebook', error)
                                                  })
                                                 
                                                }
                                                else
                                                {
                                                  console.log('logging in facebook user')

                                                }
                                                        
                                          }).catch(error)
                                          {
                                            console.log('error.', error)
                                          }                                                                       
                                  }).catch(error)
                                  {
                                    console.log('error.', error)
                                  }
                              }).catch((error) => {
                                    const { code, message } = error;
                                  });
                          }
                }
              }
              onLogoutFinished={() => console.log("logout.")} >
              </LoginButton>
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
        paddingTop: '40%',
    
      },
      inputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        height:45,
        marginBottom:10,
        marginLeft: 10,
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
      justifyContent: 'center',

    
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
    height: 35,
    width: 250,
    marginTop: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

    })

  
    