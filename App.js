import React, { Component } from 'react';

import { 
      createStackNavigator,
      createAppContainer
 } from  'react-navigation';

 import {PermissionsAndroid} from 'react-native';

import Dashboard from './app/components/Dashboard';
import Loading from './app/components/Loading';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';
import { App } from 'react-native-firebase';
import Main from './app/components/Dashboard/Main';
import PhoneAuth from './app/components/PhoneAuth';



const AppStackContainer = createStackNavigator(
  {
    home: Loading,
    signup: SignUp,
    login: Login,
    dashboard: Dashboard,
    mainContainer: MainContainer,
    phoneAuth: PhoneAuth,
  },

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }

)

export default AppContainer = createAppContainer(AppStackContainer)
