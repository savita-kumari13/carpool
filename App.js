import React, { Component } from 'react';
import firebase from 'react-native-firebase'

import { 
      createStackNavigator,
      createAppContainer
} from  'react-navigation';

import NavigationService from './NavigationService';
import Icon from 'react-native-vector-icons/Ionicons';

import Dashboard from './app/components/Dashboard';
import Loading from './app/components/Loading';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';
import Main from './app/components/Dashboard/Main';
import PhoneAuth from './app/components/PhoneAuth';

import axios from './app/components/axios';
import ForgotPassword from './app/components/ForgotPassword';


export default class App extends Component {   
  render() 
  {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    )
  }
}

const AppStackContainer = createStackNavigator(
  {
    home: {
      screen : Loading,
      navigationOptions: ({navigation}) => ({
        header: null
      })
    },
    SignUp: {
      screen : SignUp,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: '#7963b6',
          elevation: 0,
        },
        title: 'Sign up',
        headerTitleStyle: {
          fontSize: 18,
          color: '#fff',
          marginTop: 5,
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#fff" 
              style = {{marginLeft: 20, marginTop: 5,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },
    Login: {
      screen : Login,
      navigationOptions: ({navigation}) => ({
        header: null
      })
    },
    axios: axios,
    Dashboard: {
      screen : Dashboard,
      navigationOptions: ({navigation}) => ({
        header: null
      })
    },
    MainContainer: {
      screen : MainContainer,
      navigationOptions: ({navigation}) => ({
        header: null
      })
    },
    PhoneAuth: PhoneAuth,
    ForgotPassword: {
      screen : ForgotPassword,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: '#7963b6',
          elevation: 0,
        },
        title: 'Forgot password',
        headerTitleStyle: {
          fontSize: 18,
          color: '#fff',
          marginTop: 5,
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#fff" 
              style = {{marginLeft: 20, marginTop: 5,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    }
  },

  {
    // headerMode: 'none',
    // navigationOptions: {
    //   headerVisible: false,
    // }
  }

)

const AppContainer = createAppContainer(AppStackContainer)

