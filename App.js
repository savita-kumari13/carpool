import React, { Component } from 'react';
import firebase from 'react-native-firebase'

import { 
      createStackNavigator,
      createAppContainer
} from  'react-navigation';

import NavigationService from './NavigationService';

import Dashboard from './app/components/Dashboard';
import Loading from './app/components/Loading';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';
import Main from './app/components/Dashboard/Main';
import PhoneAuth from './app/components/PhoneAuth';

import axios from './app/components/axios';
import UserAndRideInfo from './app/components/Dashboard/Main/Search/UserAndRideInfo';


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
    home: Loading,
    SignUp: SignUp,
    Login: Login,
    axios: axios,
    Dashboard: Dashboard,
    MainContainer: MainContainer,
    PhoneAuth: PhoneAuth,
    //UserAndRideInfo: UserAndRideInfo
  },

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

)

const AppContainer = createAppContainer(AppStackContainer)

