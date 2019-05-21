import React, { Component } from 'react'
import { Button, Surface,} from 'react-native-paper';
import axios from '../../../axios'
import config from '../../../../config/constants'
import NavigationService from '../../../../../NavigationService'
import AsyncStorage from '@react-native-community/async-storage'


import { 
    Text,
    View,
    BackHandler,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    ScrollView,
    Alert,
    RefreshControl ,
    ToastAndroid,
    FlatList,
    NavigationActions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrowIcon2 from 'react-native-vector-icons/Ionicons'

export default class OfferedRide extends Component {
  constructor(props) {
      super(props)

      this.state = {
        ride:{},
        monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],

        daysNames : ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        ],
        bookedUsersVisible: false,
        bookedUsers: [],
      }

      this._handleBackHandler = this._handleBackHandler.bind(this);
  }
  
  async getRidePlan() {
      try {
          const ride = JSON.parse(await AsyncStorage.getItem('offered_ride'))
          this.setState({
              ride: ride
          })
          if((ride.booked_user).length > 0){
            this.setState({
              bookedUsersVisible: true,
              bookedUsers: ride.booked_user
            })
          }
      } catch (error) {
        console.log("error in async storgae ", error)
        ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
      }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus', () => {
        this.getRidePlan()
    }
  );
  componentDidMount()
  {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(config.COLOR);
    });
    BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);
  }
  componentWillUnmount()
  {
    this._navListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackHandler);
  }
  _handleBackHandler = () => {
    NavigationService.navigate('Current', {})
    return true;
   }

   async bookedUserPreferences(bookedUser){
    try {
      await AsyncStorage.setItem('booked_user', JSON.stringify(bookedUser))
      this.props.navigation.navigate('bookedUserPreferences')
    } catch (error) {
      console.log('error in async storage ', error)
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    }
  }

  renderBookedUsers =({item}) => {
    return(
      <TouchableWithoutFeedback onPress = {() => this.bookedUserPreferences(item)}>
        <View style = {{flexDirection: "row", marginTop: 10,justifyContent: 'space-between',}}>
          <Text style = {{
          fontSize: 17,
          marginTop: 10,
          fontWeight: 'bold',
          color: config.TEXT_COLOR,
          }}>{item.name}</Text>
          
        <View >
          <View style = {{marginLeft: 120, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Image style={{
                width: 40,
                height: 40,
                borderRadius: 63,
                borderWidth: 4,
            }} source={{uri: config.API_HOST + '/' + item.avatar}}/>
            <ArrowIcon2 name = 'ios-arrow-forward' 
                size = {20}
                color = '#527a7a'
                style = {{marginLeft: 15, marginTop: 15, }}
            />
          </View>
        </View>
        </View>
      </TouchableWithoutFeedback>
    )
}
  

  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}> 
        <Text style = {styles.goingTime}>Ride plan</Text>
        <Text 
            style = {styles.date}>
            {this.state.daysNames[new Date(this.state.ride.offered_ride_date_time).getDay()]}, {new Date(this.state.ride.offered_ride_date_time).getDate()} {this.state.monthNames[new Date(this.state.ride.offered_ride_date_time).getMonth()]} - {((new Date(this.state.ride.offered_ride_date_time).getHours()) < 10? '0': '') + new Date(this.state.ride.offered_ride_date_time).getHours()}:{((new Date(this.state.ride.offered_ride_date_time).getMinutes()) < 10? '0': '') + new Date(this.state.ride.offered_ride_date_time).getMinutes()}
        </Text>
        <View style = {styles.rideItemView}>
            <View style = {{ flexDirection: 'column',}}>
                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <Ionicons.Button
                    name="md-pin"
                    backgroundColor='transparent'
                    underlayColor='transparent'
                    color={'#3d5c5c'}
                    size={16}
                />
                <View style={{flexWrap: 'wrap', flex: 1}}>
                    <Text style={{color: config.TEXT_COLOR, fontSize: 16, marginLeft: -5, flexWrap: 'wrap'}}>{this.state.ride.pick_up_name}</Text>
                </View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10,}}>
                <Ionicons.Button
                    name="md-pin"
                    backgroundColor='transparent'
                    underlayColor='transparent'
                    color={'#3d5c5c'}
                    size={16}
                />
                <View style={{flexWrap: 'wrap', flex: 1}}>
                    <Text style={{color: config.TEXT_COLOR, fontSize: 16, marginLeft: -5,}}>{this.state.ride.drop_off_name}</Text>
                </View>
                </View>
            </View>
        </View>

        <View style={{
            marginTop: 30,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
        }}/>

        {!this.state.bookedUsersVisible && 
        <Text style = {{
          marginTop: 20,
          color: '#999999',
          fontWeight: 'bold',
          fontSize: 16,
        }}>No passengers yet</Text>}

        {this.state.bookedUsersVisible && 
         <FlatList
            data={this.state.bookedUsers}
            renderItem={this.renderBookedUsers}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle = {{marginVertical: 10, }}
            keyExtractor={(item) => { return item._id; }}
        />}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      marginTop: 10,
      // justifyContent: 'center',
    },
    goingTime: {
        fontWeight: 'bold',
        fontFamily: "sans-serif-condensed",
        fontSize: 28,
        fontWeight: 'bold',
        color: config.TEXT_COLOR,
        marginLeft: 10,
      },

    date: {
    color: config.TEXT_COLOR,
    fontWeight: 'bold',
    fontSize: 16,
    // fontFamily: "sans-serif-condensed",
    marginLeft: 10,
    marginTop: 25
    },

    rideItemView: {
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
      },
  })
