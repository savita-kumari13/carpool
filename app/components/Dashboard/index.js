import React, { Component } from 'react'
import { BackHandler } from 'react-native'
import firebase from 'react-native-firebase';
import { HeaderBackButton } from 'react-navigation';

import Dialog, { SlideAnimation, DialogContent, DialogTitle } from 'react-native-popup-dialog';
import   CardView  from 'react-native-cardview';
import Icon from 'react-native-vector-icons/Ionicons';


//const settingIcon = (<Icon name = "ios-settings" size = {25} color = "#000000" style = {{marginRight: 10}}/>)
const notificationsIcon = (<Icon name = "ios-notifications" size = {25} color = "#000000" style = {{marginRight: 10}}/>)

import 
{ 
  Text,
  StyleSheet,
  View,
  ScrollView,
  Button,
  Image,
  Alert,
  ImageBackground,
 } from 'react-native'
import Main from './Main';

export default class Dashboard extends Component {

  state = {
    currentUser : null,
  };
  

     constructor(props) {
      super(props)
      this.handleBackPress = this.handleBackPress.bind(this);
  }

  static navigationOptions = {
    headerTransparent: true,
    title: 'PoolCar',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerLeft: null,
    headerRight: (
      <View style = {{ flexDirection: 'row',}}>

        {notificationsIcon}
        <Icon name = "ios-settings" 
          size = {25} color = "#000000" 
          style = {{marginRight: 10}}
          // onPress = {this.props.navigation.navigate('settings')}
        />

    </View>
    ),
  }

    // static navigationOptions = ({navigation}) =>{
    //   return{
    //     headerLeft:(<HeaderBackButton onPress={()=>{navigation.navigate('login')}}/>)
    //  }
    // }


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
    this.props.navigation.navigate('login')
    return true;
    // BackHandler.exitApp();
  }

  signOut = () => {
    firebase.auth().signOut().then(res => {
      console.log('user logged out successfully')
    }).catch(error => {
      console.log('error in signOut', error)
    })
  }

  render() {
    const { currentUser } = this.state
    
    return (
      

      <View style = {styles.container}>
        <Button title="Sign Out" color="#33adff" onPress={this.signOut} />

      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


})

