import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    BackHandler,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import config from '../../../../config/constants'

export default class OfferedRideUserBio extends Component {
    constructor(props){
        super(props)
        this.state = {
            userName: '',
            userAbout: '',
            avatar: '',
            bio: '',
            userPreferences: [],

            showUserBio: false,
            smokeOkVisible: false,
            noSmokeVisible: false,

            petsOkVisible: false,
            noPetsVisible: false,
            isLoadingUser: false,

        }
    }

    gettingUSerBio = async() =>{
        this.setState({
            isLoadingUser: true
        })
        try {
          const ride = JSON.parse(await AsyncStorage.getItem('booked_ride'))
          const user_name = ride.offered_user.name
          const user_preferences = ride.offered_user.preferences
          const user_avatar = ride.offered_user.avatar
          const user_bio = ride.offered_user.bio
          if(user_bio !== undefined && user_bio !== null && user_bio != 'null' && user_bio != ''){
              this.setState({
                  showUserBio: true
              })
          }
          this.setState({
              userName: user_name,
              userPreferences: user_preferences,
              avatar: user_avatar,
              bio: user_bio
          })
          if(this.state.userPreferences.smoking === config.SMOKING.NO_SMOKING)
          {
              this.setState({
                  noSmokeVisible: true,
                  smokeOkVisible: false
              })
          }
          if( this.state.userPreferences.smoking === config.SMOKING.YES_SMOKING)
          {
              this.setState({
                  smokeOkVisible: true,
                  noSmokeVisible: false,
              })
          }
          if(this.state.userPreferences.pets === config.PETS.NO_PETS )
          {
              this.setState({
                  noPetsVisible: true,
                  petsOkVisible: false,
              })
          }
          if( this.state.userPreferences.pets === config.PETS.PETS_WELCOME)
          {
              this.setState({
                  petsOkVisible: true,
                  noPetsVisible: false,
              })
          }
          this.setState({
              isLoadingUser: false
          })
      } catch (error) {
          this.setState({
              isLoadingUser: false
          })
          ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
      }     
  }
    willFocus = this.props.navigation.addListener(
        'willFocus', () => {
          this.gettingUSerBio();
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
        this.props.navigation.goBack()
         return true;
       }

  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
      {this.state.isloadingUser && <ActivityIndicator size="large" />}
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={{uri: config.API_HOST + '/' + this.state.avatar}}/>
                <Text style={styles.name}>{this.state.userName} </Text>
            </View>
          </View>
          {this.state.showUserBio &&
          <View>
              <Text style = {{
                fontSize: 16,
                marginTop: 15,
                marginLeft: 10,
                fontWeight: 'bold',
                color: '#737373',
                }}>{this.state.bio}</Text>
          </View>}

        <View style={{
            marginTop: this.state.showUserBio ? 20: 25,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
        }}/>
        <View style = {{marginTop: 30, flexDirection: 'row'}}>
            <Image
                style={{width: 28, height: 28}}
                source={require('../../../../../icons/chat.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.chattiness}
            </Text>
        </View>
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 28, height: 28}}
                source={require('../../../../../icons/music.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.music}
            </Text>
        </View>
        {this.state.noSmokeVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/no_smoking.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.smoking}
            </Text>
        </View>}

        {this.state.smokeOkVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/smoking.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.smoking}
            </Text>
        </View>}

        {this.state.petsOkVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/pet.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.pets}
            </Text>
        </View>}
        {this.state.noPetsVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/no_pet.png')}/>
            <Text style = {styles.smoke}>
                {this.state.userPreferences.pets}
            </Text>
        </View>}

        <View style={{
            marginTop: 30,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
        }}/>
        
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        // showsVerticalScrollIndicator: false 
      },

    header:{
        // backgroundColor: "#DCDCDC",
    },

    headerContent:{
    padding:10,
    alignItems: 'center',
    },

    avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    },

    name:{
        fontSize:22,
        color:config.TEXT_COLOR,
        fontWeight:'bold',
      },

    smoke: {
    marginTop: 8,
    marginLeft: 20,
    color: '#527a7a',
    fontWeight: 'bold',
    fontSize: 17,
    }
})