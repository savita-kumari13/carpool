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
import AsyncStorage from '@react-native-community/async-storage'
import { Button} from 'react-native-paper';
import axios from '../../../axios'
import config from '../../../../config/constants'
import ImagePicker from 'react-native-image-picker';
import CountryPicker from 'react-native-country-picker-modal';


export default class Bio extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      uri: config.API_HOST + '/user_default_profile_photo.jpg',
      name: '',
      phoneNumber: '',
      bio: '',
      isNameFocused: false,
      isBioFocused: false,
      isPhoneFocused: false,
      enterCode: false,
      country: {
        cca2: 'IN',
        callingCode: '91'
      }
    }
    this._handleBackHandler = this._handleBackHandler.bind(this);

  }

  getBio(){
    axios.get('/users/get_profile')
    .then(res => {
      const resData = res.data      
      console.log(res);
      this.setState({
        uri: config.API_HOST + '/' + resData.response.user.avatar,
        name: resData.response.user.name,
        bio: resData.response.user.bio,
        phoneNumber: (resData.response.user.phone_number).toString()
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

  setProfilePhoto(){
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }else {
        console.log('User selected a file form camera or gallery', response);
        this.setState({
            uri : response.uri,
        })
        const data = new FormData();
        data.append('name', 'avatar');
        data.append('image', {
          uri : response.uri,
          type: response.type,
          name: response.fileName,
          path: response.path
        });
        axios.post('/users/add_profile_photo', data)
        .then((res)=>{
          const resData = res.data      
          console.log(res);
          this.setState({
            uri: config.API_HOST + '/' + resData.response.user.avatar
          })
        })
        .catch((err)=>{
          console.log(err)
        });
      }
    })
  }
  handleNameFocus = () => this.setState({isNameFocused: true})
  handleNameBlur = () => this.setState({isNameFocused: false})

  handleBioFocus = () => this.setState({isBioFocused: true})
  handleBioBlur = () => this.setState({isBioFocused: false})

  handlePhoneFocus = () => this.setState({isPhoneFocused: true})
  handlePhoneBlur = () => this.setState({isPhoneFocused: false})

  _changeCountry = (country) => {
    this.setState({ country });
  }

  _renderCountryPicker = () => {
    if (this.state.enterCode)
      return (
        <View/>
      );
    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        translation='eng'/>
    );
  }

  _renderCallingCode = () => {
    if (this.state.enterCode)
      return (
        <View />
      );
    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  updateProfile(){
    const data = {
      name: this.state.name,
      phone_number: this.state.phoneNumber,
      bio: this.state.bio
    }
    axios.post('/users/update_profile', data)
    .then(res => {
      this.props.navigation.navigate('Profile')
    })
    .catch(err => {
      console.log('error sending update profile request')
    })
  }
  
  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>          
        <TouchableOpacity style={styles.photo} 
            onPress={()=>{ this.setProfilePhoto()}}>
            <Image
              style={{
              paddingVertical: 30,
              width: 70,
              height: 70,
              borderRadius: 63
              }}
              resizeMode='cover'
              source={{
                uri: this.state.uri 
              }}
            />
          <Text style={{color: '#7963b6',
            fontWeight: 'bold',
            marginRight:70,
            alignSelf:'center',
            fontSize: 16}}
            onPress = {() => this.props.navigation.navigate('Bio')}>Change profile photo</Text>
        </TouchableOpacity>
        <View style={{
            marginTop: 20,
            marginHorizontal: -10,
            borderBottomColor: '#cccccc',
            borderBottomWidth: 0.5,
        }}/>

        <Text style = {{color: '#5c8a8a', fontWeight: 'bold',fontSize: 14, marginTop:30,}}>About you</Text>
        <View style = {{marginTop:35, paddingLeft: 10}}>
          <Text style = {{color: '#737373', fontWeight: 'bold',fontSize: 16,}}>Name</Text>
          <TextInput 
            onFocus={this.handleNameFocus}
            onBlur={this.handleNameBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isNameFocused? '#7963b6': '#000'),
              borderBottomWidth: this.state.isNameFocused? 2: 1,}]}
            onChangeText={name => this.setState({name: name,})}
            value={this.state.name}/>

        <Text style = {{color: '#737373', fontWeight: 'bold',fontSize: 16,  marginTop:35}}>YOUR BIO</Text>
          <TextInput 
            onFocus={this.handleBioFocus}
            onBlur={this.handleBioBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isBioFocused? '#7963b6': '#000'),
              borderBottomWidth: this.state.isBioFocused? 2: 1,}]}
              selectionColor={'#7963b6'}
            onChangeText={bio => this.setState({bio: bio,})}
            value={this.state.bio}/>

        <Text style = {{color: '#737373', fontWeight: 'bold',fontSize: 16,  marginTop:35}}>PHONE NUMBER</Text>
        <View style={{ flexDirection: 'row', marginTop: 30 }}>
            {this._renderCountryPicker()}
            {this._renderCallingCode()}
            <TextInput
              onFocus={this.handlePhoneFocus}
              onBlur={this.handlePhoneBlur}
              onChangeText={phoneNumber => this.setState({phoneNumber: phoneNumber,})}
              value={this.state.phoneNumber}
              keyboardType = "phone-pad"
              style={[ styles.textInput,
                {borderBottomColor: (this.state.isPhoneFocused? '#7963b6': '#000'),
                borderBottomWidth: this.state.isPhoneFocused? 2: 1,} ]}
              placeholderTextColor={'#737373'}
              selectionColor={'#7963b6'}
              maxLength={this.state.enterCode ? 6 : 20} />
        </View>
          <Button 
          style={[styles.saveProfileBtn]}
          onPress={() => this.updateProfile()}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }} >Save profile info</Text>
        </Button> 
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
       padding: 20,
       marginTop:15
    },
    photo:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginLeft: 10,
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 63,
      borderWidth: 4,
      alignSelf:'center',
      position: 'absolute',
      marginTop:40
    },
  
    inputs:{
      marginTop: 15,
      borderBottomWidth: 2,
      padding: 0,
      flex: 1,
      fontSize: 16,
      color: '#054752',
      fontWeight: 'bold'
  },

  textInput: {
    borderBottomWidth: 2,
    padding: 0,
    flex: 1,
    fontSize: 16,
    color: '#054752',
    fontWeight: 'bold'
  },

  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  callingCodeText: {
    fontSize: 16,
    color: '#054752',
    fontWeight: 'bold',
    paddingRight: 10
  },

  saveProfileBtn: {
    marginTop: 60,
    borderRadius: 30,
    width: 300,
    height: 45,
    backgroundColor: "#7963b6",
    justifyContent: 'center',
  },
  })