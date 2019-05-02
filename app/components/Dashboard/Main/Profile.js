import React, { Component } from 'react'
import { NavigationActions ,} from 'react-navigation'
import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  AsyncStorage,
} from 'react-native'

export default class Profile extends Component {

  constructor(props) {
    super(props)
    this._handleBackHandler = this._handleBackHandler.bind(this);
}


componentDidMount()
{

  this._navListener = this.props.navigation.addListener('didFocus', () => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#7963b6');
  });
  BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);
}

componentWillUnmount()
{

  this._navListener.remove();

  BackHandler.removeEventListener('hardwareBackPress', this._handleBackHandler);
}

_handleBackHandler = () => {
  this.props.navigation.dispatch(NavigationActions.back())
   return true;
 }


  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <SafeAreaView style= { backgroundColor = '#7963b6' }/>
        <View style = {styles.profilePhotoView}
        onPress = {this.showTokenId()}
        >
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
          <Text>profileeeee</Text>
        </View>
        <View style  = {styles.profileContentView}>
          <Text>profileeeee  Content</Text>
        </View>

      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
     flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  profilePhotoView: {
    flex: 1/2,
    backgroundColor: '#7963b6',
  },

  profileContentView: {
    flex: 1,
    // backgroundColor: 'grey'

  }


})