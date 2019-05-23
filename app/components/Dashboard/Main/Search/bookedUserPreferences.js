import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView,
    Linking,
    ActivityIndicator,
    NavigationActions ,
    BackHandler,
    StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import config from '../../../../config/constants'
import call from 'react-native-phone-call'

export default class bookedUserPreferences extends Component {
  constructor(props){
    super(props)
    this.state = {
      bookedUserBio: '',
      avatar: '',
      bookedUser: [],

      showUserBio: false,
      chattinessVisible: false,

      musicOkVisible: false,
      noMusicVisible: false,

      smokeOkVisible: false,
      noSmokeVisible: false,

      petsOkVisible: false,
      noPetsVisible: false,

      isloadingUser: false,
    }
  }

  gettingUSerBio = async() =>{
    this.setState({
        isloadingUser: true
    })
    try {
      const booked_user = JSON.parse(await AsyncStorage.getItem('booked_user'))
      if(booked_user !== null){
        this.setState({
            bookedUser: booked_user,
            avatar: booked_user.avatar
        })
        if(booked_user.bio !== undefined && booked_user.bio !== null && booked_user.bio != 'null' && booked_user.bio != ''){
            this.setState({
                bookedUserBio: booked_user.bio,
                showUserBio: true
            })
        }
        if(this.state.bookedUser.preferences.chattiness === config.CHATTINESS.DONT_KNOW ||
            this.state.bookedUser.preferences.chattiness === config.CHATTINESS.QUIT_TYPE ||
            this.state.bookedUser.preferences.chattiness === config.CHATTINESS.LOVE_TO_CHAT)
        {
            this.setState({
                chattinessVisible: true,
            })
        }
        if(this.state.bookedUser.preferences.smoking === config.SMOKING.NO_SMOKING)
        {
            this.setState({
                noSmokeVisible: true,
                smokeOkVisible: false
            })
        }
        if( this.state.bookedUser.preferences.smoking === config.SMOKING.YES_SMOKING)
        {
            this.setState({
                smokeOkVisible: true,
                noSmokeVisible: false,
            })
        }
        if(this.state.bookedUser.preferences.pets === config.PETS.NO_PETS )
        {
            this.setState({
                noPetsVisible: true,
                petsOkVisible: false,
            })
        }
        if( this.state.bookedUser.preferences.pets === config.PETS.PETS_WELCOME)
        {
            this.setState({
                petsOkVisible: true,
                noPetsVisible: false,
            })
        }

        if(this.state.bookedUser.preferences.smoking === config.MUSIC.SILENCE)
        {
            this.setState({
                noMusicVisible: true,
                musicOkVisible: false
            })
        }
        if( this.state.bookedUser.preferences.music === config.MUSIC.ALL_ABOUT_PLAYLIST)
        {
            this.setState({
                musicOkVisible: true,
                noMusicVisible: false,
            })
        }
        this.setState({
            isloadingUser: false
        })
      }
      else{
          this.setState({
              isloadingUser: false
          })
      }
  } catch (error) {
      this.setState({
          isloadingUser: false
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
                <Text style={styles.name}>{this.state.bookedUser.name} </Text>
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
                }}>{this.state.bookedUserBio}</Text>
          </View>}

        <View style={{
            marginTop: this.state.showUserBio ? 25: 20,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 1,
        }}/>

        {this.state.chattinessVisible &&
            <View style = {{marginTop: 30, flexDirection: 'row'}}>
                <Image
                    style={{width: 28, height: 28}}
                    source={require('../../../../../icons/chat.png')}/>
                <Text style = {styles.smoke}>
                    {this.state.bookedUser.preferences.chattiness}
                </Text>
            </View>}

        {this.state.noMusicVisible &&
            <View style = {{marginTop: 15, flexDirection: 'row'}}>
                <Image
                    style={{width: 30, height: 30}}
                    source={require('../../../../../icons/music.png')}/>
                <Text style = {styles.smoke}>
                    {this.state.bookedUser.preferences.music}
                </Text>
            </View>}

            {this.state.musicOkVisible &&
            <View style = {{marginTop: 15, flexDirection: 'row'}}>
                <Image
                    style={{width: 30, height: 30}}
                    source={require('../../../../../icons/music.png')}/>
                <Text style = {styles.smoke}>
                    {this.state.bookedUser.preferences.music}
                </Text>
            </View>}




        {this.state.noSmokeVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/no_smoking.png')}/>
            <Text style = {styles.smoke}>
                {this.state.bookedUser.preferences.smoking}
            </Text>
        </View>}

        {this.state.smokeOkVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/smoking.png')}/>
            <Text style = {styles.smoke}>
                {this.state.bookedUser.preferences.smoking}
            </Text>
        </View>}

        {this.state.petsOkVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/pet.png')}/>
            <Text style = {styles.smoke}>
                {this.state.bookedUser.preferences.pets}
            </Text>
        </View>}
        {this.state.noPetsVisible &&
        <View style = {{marginTop: 15, flexDirection: 'row'}}>
            <Image
                style={{width: 30, height: 30}}
                source={require('../../../../../icons/no_pet.png')}/>
            <Text style = {styles.smoke}>
                {this.state.bookedUser.preferences.pets}
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
    fontSize: 16,
    }
})
