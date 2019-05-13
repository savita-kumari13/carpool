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
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native'

import { Button} from 'react-native-paper';
import axios from '../../../axios'
import config from '../../../../config/constants'
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons'


export default class Preferences extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        chattiness: config.CHATTINESS.DONT_KNOW,
        smoking: config.SMOKING.DONT_KNOW,
        music: config.MUSIC.DONT_KNOW,
        pets: config.PETS.DONT_KNOW,

        smokeOkVisible: true,
        noSmokeVisible: false,

        musicOkVisible: true,
        noMusicVisible: false,

        petsOkVisible: true,
        noPetsVisible: false,
      }
      this._handleBackHandler = this._handleBackHandler.bind(this);
    }

    getBio(){
        axios.get('/users/get_profile')
        .then(res => {
          const resData = res.data      
          console.log(res);
          this.setState({
            chattiness: resData.response.user.preferences.chattiness,
            smoking: resData.response.user.preferences.smoking,
            music: resData.response.user.preferences.music,
            pets: resData.response.user.preferences.pets,
          })
        }).catch(err => {
          console.log('error sending get bio request ', err)
        })
      }
    componentDidMount()
    {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor('#7963b6');
      });
      BackHandler.addEventListener('hardwareBackPress', this._handleBackHandler);
    }
  
    willFocus = this.props.navigation.addListener(
      'willFocus', () => {
        this.getBio();
      }
    );
    componentWillUnmount()
    {
      this._navListener.remove();
      BackHandler.removeEventListener('hardwareBackPress', this._handleBackHandler);
    }
  
    _handleBackHandler = () => {
      this.props.navigation.dispatch(NavigationActions.back())
      return true;
    }
    dropdown_chattiness(idx, value) {
        this.setState({
            chattiness: value,
          })
      }
    dropdown_smoking(idx, value) {
        this.setState({
            smoking: value,
        })
        if(value == config.SMOKING.NO_SMOKING ){
            this.setState({
                noSmokeVisible: true,
                smokeOkVisible: false
            })
        }

        if(value == config.SMOKING.YES_SMOKING ){
            this.setState({
                noSmokeVisible: false,
                smokeOkVisible: true
            })
        }
        
        if(value == config.SMOKING.DONT_KNOW ){
            this.setState({
                noSmokeVisible: false,
                smokeOkVisible: true
            })
        }
    }
    dropdown_music(idx, value) {
        this.setState({
            music: value,
        })
        if(value == config.MUSIC.SILENCE ){
            this.setState({
                noMusicVisible: true,
                musicOkVisible: false
            })
        }

        if(value == config.MUSIC.ALL_ABOUT_PLAYLIST ){
            this.setState({
                noMusicVisible: false,
                musicOkVisible: true
            })
        }
        
        if(value == config.MUSIC.DONT_KNOW ){
            this.setState({
                noMusicVisible: false,
                musicOkVisible: true
            })
        }
    }
    dropdown_pets(idx, value) {
        this.setState({
            pets: value,
        })
        if(value == config.PETS.NO_PETS ){
            this.setState({
                noPetsVisible: true,
                petsOkVisible: false
            })
        }

        if(value == config.PETS.PETS_WELCOME){
            this.setState({
                noPetsVisible: false,
                petsOkVisible: true
            })
        }
        
        if(value == config.PETS.DONT_KNOW ){
            this.setState({
                noPetsVisible: false,
                petsOkVisible: true
            })
        }
    }

    savePreference(){
        const data = {
            chattiness: this.state.chattiness,
            smoking: this.state.smoking,
            music: this.state.music,
            pets: this.state.pets
        }
        axios.post('/users/save_preferences', data)
        .then(res => {
            this.props.navigation.navigate('Profile')
        })
        .catch(err => {
            console.log('error sending save preferences request ', err)
        })
    }
    
  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <Text style = {styles.label}>Chattiness</Text>
        <View style = {{ flexDirection: 'row',justifyContent: 'space-between',}}>
            <Image
                style={{width: 24, height: 24,}}
                source={require('../../../../../icons/chat.png')}/>
            <ModalDropdown
                options={[config.CHATTINESS.LOVE_TO_CHAT, config.CHATTINESS.DONT_KNOW, config.CHATTINESS.QUIT_TYPE]}
                defaultValue = {this.state.chattiness}
                style = {styles.modelDropDown}
                textStyle = {styles.textStyle}
                dropdownStyle = {styles.dropDownStyle}
                dropdownTextStyle = {styles.dropdownTextStyle}
                onSelect={(idx, value) => this.dropdown_chattiness(idx, value)}
            >
            
        </ModalDropdown>
        <View style={{
                justifyContent: 'center',
                flexDirection: 'row',
               }}>
                <Icon name={'md-arrow-dropdown'} size = {25} color = {'#7963b6'}
                    style = {{ marginTop: 10,}}/>
            </View>
        </View>

        <Text style = {styles.label}>Smoking</Text>
        <View style = {{ flexDirection: 'row',justifyContent: 'space-between',}}>
            {this.state.smokeOkVisible &&
            <Image
                style={{width: 24, height: 24,}}
                source={require('../../../../../icons/smoking.png')}/>}
            {this.state.noSmokeVisible &&
            <Image
                style={{width: 24, height: 24,}}
                source={require('../../../../../icons/no_smoking.png')}/>}
            <ModalDropdown
                options={[config.SMOKING.YES_SMOKING, config.SMOKING.DONT_KNOW, config.SMOKING.NO_SMOKING]}
                defaultValue = {this.state.smoking}
                style = {styles.modelDropDown}
                textStyle = {styles.textStyle}
                dropdownStyle = {styles.dropDownStyle}
                dropdownTextStyle = {styles.dropdownTextStyle}
                onSelect={(idx, value) => this.dropdown_smoking(idx, value)}
            >  
            </ModalDropdown>
            <View style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}>
                    <Icon name={'md-arrow-dropdown'} size = {25} color = {'#7963b6'}
                        style = {{ marginTop: 10,}}/>
            </View>
        </View>

        <Text style = {styles.label}>Music</Text>
        <View style = {{ flexDirection: 'row',justifyContent: 'space-between',}}>
            {this.state.musicOkVisible &&
            <Image
                style={{width: 24, height: 24,}}
                source={require('../../../../../icons/music.png')}/>}
            {this.state.noMusicVisible &&
            <Image
                style={{width: 24, height: 24,}}
                source={require('../../../../../icons/no_music.png')}/>}
            <ModalDropdown
                options={[config.MUSIC.ALL_ABOUT_PLAYLIST, config.MUSIC.DONT_KNOW, config.MUSIC.SILENCE]}
                defaultValue = {this.state.music}
                style = {styles.modelDropDown}
                textStyle = {styles.textStyle}
                dropdownStyle = {styles.dropDownStyle}
                dropdownTextStyle = {styles.dropdownTextStyle}
                onSelect={(idx, value) => this.dropdown_music(idx, value)}
            >
            </ModalDropdown>
            <View style={{
                justifyContent: 'center',
                flexDirection: 'row',
               }}>
                <Icon name={'md-arrow-dropdown'} size = {25} color = {'#7963b6'}
                    style = {{ marginTop: 10,}}/>
            </View>
        </View>

        <Text style = {styles.label}>Pets</Text>
        <View style = {{ flexDirection: 'row',justifyContent: 'space-between',}}>
            {this.state.petsOkVisible &&
            <Image
                style={{width: 24, height: 24,}}
                source={require('../../../../../icons/pet.png')}/>}
            {this.state.noPetsVisible &&
            <Image
                style={{width: 24, height: 24,}}
                source={require('../../../../../icons/no_pet.png')}/>}
            <ModalDropdown
                options={[config.PETS.PETS_WELCOME, config.PETS.DONT_KNOW, config.PETS.NO_PETS]}
                defaultValue = {this.state.pets}
                style = {styles.modelDropDown}
                textStyle = {styles.textStyle}
                dropdownStyle = {styles.dropDownStyle}
                dropdownTextStyle = {styles.dropdownTextStyle}
                onSelect={(idx, value) => this.dropdown_pets(idx, value)}
            >   
            </ModalDropdown>
            <View style={{
                justifyContent: 'center',
                flexDirection: 'row',
               }}>
                <Icon name={'md-arrow-dropdown'} size = {25} color = {'#7963b6'}
                    style = {{ marginTop: 10,}}/>
            </View>
        </View>
        <View style={{alignItems: 'center',}}>
        <Button 
          style={[styles.savePreferenceBtn]}
          onPress={() => this.savePreference()}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }} >Save preferences</Text>
        </Button> 
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
     },
     label: {
        color: '#8c8c8c',
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 40,
        marginTop: 30,
     },

     modelDropDown: {
        width: 260,
        borderBottomWidth: 1,
        borderBottomColor: '#054752',
        padding: 0,
        marginTop: 10,
        marginLeft: 10,
     },

     textStyle: {
        color: '#054752',
        fontWeight: 'bold',
        fontSize: 18,
     },

     dropDownStyle: {
        width: 260,
        borderColor: '#7963b6',
     },

     dropdownTextStyle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },

    savePreferenceBtn: {
        marginTop: 60,
        borderRadius: 30,
        width: 300,
        height: 45,
        backgroundColor: "#7963b6",
        justifyContent: 'center',
      },
})
