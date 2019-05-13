import React, { Component } from 'react'
import { Text, View, BackHandler } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';
import IconOffer from 'react-native-vector-icons/EvilIcons';
import IconInbox from 'react-native-vector-icons/AntDesign';
import IconProfile from 'react-native-vector-icons/MaterialIcons';

import
  { 
    createBottomTabNavigator,
    createAppContainer,
    createStackNavigator,
    createMaterialTopTabNavigator,
  } from 'react-navigation'

import Inbox from './Inbox'
import Profile from './Profile/Profile'
import History from './Rides/History';
import Current from './Rides/Current';
import Search from './Search/Search';
import Offer from './Offer/Offer';
import Calendarr from './Offer/Calendarr';
import PriceAndAboutRide from './Offer/PriceAndAboutRide';
import TimeAndPassengersNumber from './Offer/TimeAndPassengersNumber';
import SearchList from './Search/SearchList';
import UserAndRideInfo from './Search/UserAndRideInfo'
import UserBio from './Search/UserBio';
import BookRide from './Search/BookRide';
import bookedUserPreferences from './Search/bookedUserPreferences';
import CarMake from './Profile/CarMake';
import Bio from './Profile/Bio';
import Preferences from './Profile/Preferences';
import DrivingCar from './Offer/DrivingCar';
import ChangePassword from './Profile/ChangePassword';

const backArrow = <Icon name = "ios-arrow-round-back" 
              size = {25} color = "#000000" 
              style = {{marginRight: 10}}
            // onPress = {this.props.navigation.navigate('settings')}
          />




const RidesTabNavigator = createMaterialTopTabNavigator(
  {
    Current: { screen: Current,

    },

    History: { screen: History,

    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#7963b6',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: '#fff'
      },

      indicatorStyle: {
        backgroundColor: '#7963b6'

      },

    }
  }
  )


  const RidesStack = createStackNavigator(
    {
      RideScreen: { screen: RidesTabNavigator
      }
  
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
  )



const MainTabNavigator = createBottomTabNavigator(
  {
        Rides: { screen: RidesStack,
          navigationOptions: {
            tabBarLabel: 'Rides',
            tabBarIcon: ({tintColor}) => (
              <Icon name = "ios-car" color = {tintColor} size = {24}/>
            ),
          }
        },

        Search: { screen: Search,
          navigationOptions: {
            tabBarLabel: 'Search',
            tabBarIcon: ({tintColor}) => (
              <Icon name = "ios-search" color = {tintColor} size = {24}/>
            ),
          }
         },

        Offer: { screen: Offer,
          navigationOptions: {
            tabBarLabel: 'Offer',
            tabBarIcon: ({tintColor}) => (
              <IconOffer name = "plus" color = {tintColor} size = {24}/>
            ),
          }
         },

        Profile: { screen: Profile,
          navigationOptions: {
            tabBarLabel: 'Profile',
            tabBarIcon: ({tintColor}) => (
              <IconProfile name = "person-outline" color = {tintColor} size = {24}/>
            )
          }
        },
    }, 
    {

      navigationOptions: ({navigation}) => {
        const { routeName } = navigation.state.routes[navigation.state.index];
        return {
          headerTitle: routeName,
          headerTitleStyle: {
            color: '#fff'
          },
          headerStyle: {
            backgroundColor: '#7963b6',
            elevation: 0,
          },
        }
      },

      initialRouteName: 'Rides',

      tabBarOptions: {
        activeTintColor: '#7963b6',
        inactiveTintColor: 'grey',
        labelStyle: {
          fontWeight: 'bold'
        }
        
      },

    }
  );


  const MainStackContainer = createStackNavigator({
    MainScreen:
    {
      screen: MainTabNavigator
    },

    Calendarr:{
      screen: Calendarr,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    TimeAndPassengersNumber: {
      screen: TimeAndPassengersNumber,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    DrivingCar: {
      screen: DrivingCar,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    PriceAndAboutRide: {
      screen: PriceAndAboutRide,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    SearchList: {
      screen: SearchList,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    UserAndRideInfo: {
      screen: UserAndRideInfo,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    UserBio: {
      screen: UserBio,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    BookRide: {
      screen: BookRide,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,        
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    bookedUserPreferences: {
      screen: bookedUserPreferences,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',
          elevation: 0,       
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    CarMake: {
      screen: CarMake,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: '#7963b6',
          elevation: 0,
        },
        title: 'Your car details',
        headerTitleStyle: {
          fontSize: 18,
          color: '#fff',
          marginTop: 15,
          // fontFamily: 'sans-serif-light'
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#fff" 
              style = {{marginLeft: 20, marginTop: 15,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    Bio: {
      screen: Bio,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: '#7963b6',
          elevation: 0,
        },
        title: 'Edit profile',
        headerTitleStyle: {
          fontSize: 18,
          color: '#fff',
          marginTop: 15,
          // fontFamily: 'sans-serif-light'
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#fff" 
              style = {{marginLeft: 20, marginTop: 15,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    Preferences: {
      screen: Preferences,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: '#7963b6',
          elevation: 0,
        },
        title: 'Edit preferences',
        headerTitleStyle: {
          fontSize: 18,
          color: '#fff',
          marginTop: 15,
          // fontFamily: 'sans-serif-light'
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#fff" 
              style = {{marginLeft: 20, marginTop: 15,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: '#7963b6',
          elevation: 0,
        },
        title: 'Change password',
        headerTitleStyle: {
          fontSize: 18,
          color: '#fff',
          marginTop: 15,
          // fontFamily: 'sans-serif-light'
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#fff" 
              style = {{marginLeft: 20, marginTop: 15,}}
              onPress = {() => navigation.goBack()}
          />     
      })
    },

  },
 

  
    {
      initialRouteName: 'MainScreen',
      headerMode: 'screen'

    }
  );

export default MainContainer = createAppContainer(MainStackContainer);
