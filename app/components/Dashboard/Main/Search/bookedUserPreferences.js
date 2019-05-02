import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    ScrollView,

} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import config from '../../../../config/constants'

export default class bookedUserPreferences extends Component {
    constructor(props){
        super(props)
        this.state = {
            userAbout: '',
            bookedUser: [],

            chattinessVisible: false,

            musicOkVisible: false,
            noMusicVisible: false,

            smokeOkVisible: false,
            noSmokeVisible: false,

            petsOkVisible: false,
            noPetsVisible: false,

        }
    }
    componentDidMount(){
        gettingUSerBio = async() =>{
            const booked_user = JSON.parse(await AsyncStorage.getItem('booked_user'))
            if(booked_user !== null){
                this.setState({
                    bookedUser: booked_user
                })
                console.log('zzzzzzzzzzzzzzzzbbsibdibcdscdscd', this.state.bookedUser)
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
            }
        }
        gettingUSerBio()
    }

  render() {
    return (
        <ScrollView contentContainerStyle = {styles.container}>
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                <Text style={styles.name}>{this.state.bookedUser.name} </Text>
            </View>
          </View>

          <View>
              <Text>Userrrr BIOO</Text>
          </View>

        <View style={{
            marginTop: 30,
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
        color:"#054752",
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
