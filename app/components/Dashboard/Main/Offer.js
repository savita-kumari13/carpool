import React, { Component } from 'react'
import { NavigationActions ,} from 'react-navigation'
import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native'

export default class Offer extends Component {

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
      <View>
        <SafeAreaView style={[styles.container, { backgroundColor: '#7963b6' }]}/>
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