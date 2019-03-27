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
import Profile from './Profile'
import History from './Rides/History';
import Current from './Rides/Current';
import Search from './Search';
import Offer from './Offer/Offer';
import Calendarr from './Offer/Calendarr';
import Time from './Offer/Time';
import PassengersNumber from './Offer/PassengersNumber';
import Price from './Offer/Price';
import AboutRide from './Offer/AboutRide';

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

        Inbox: { screen: Inbox,
          navigationOptions: {
            tabBarLabel: 'Inbox',
            tabBarIcon: ({tintColor}) => (
              <IconInbox name = "message1" color = {tintColor}  size = {19}/>
            )
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
            backgroundColor: '#7963b6'
          },
        }
      },

      initialRouteName: 'Offer',

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
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    Time: {
      screen: Time,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    PassengersNumber: {
      screen: PassengersNumber,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    Price: {
      screen: Price,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    },

    AboutRide: {
      screen: AboutRide,
      navigationOptions: ({navigation}) => ({
        headerStyle:{
          backgroundColor: 'transparent',         
        },
        headerLeft: 
          <Icon name = "ios-arrow-round-back" 
              size = {40} color = "#7963b6" 
              style = {{marginLeft: 20, marginTop: 20,}}
              onPress = {() => navigation.goBack()}
          />
        
        
      })
    }
  },
 

  
    {
      initialRouteName: 'MainScreen',
      headerMode: 'screen'

    }
  );

export default MainContainer = createAppContainer(MainStackContainer);
