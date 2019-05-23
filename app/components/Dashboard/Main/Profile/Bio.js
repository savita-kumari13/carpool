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
  ActivityIndicator,
  ToastAndroid
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
      },
      isGetBio: false,
      isLoading: false
    }
    this._handleBackHandler = this._handleBackHandler.bind(this);

  }

  getBio(){
    this.setState({
      isGetBio: true
    })
    axios.get('/users/get_profile')
    .then(res => {
      const resData = res.data
      if(resData.status){
        this.setState({
          uri: config.API_HOST + '/' + resData.response.user.avatar,
          name: resData.response.user.name,
          bio: resData.response.user.bio,
          phoneNumber: (resData.response.user.phone_number).toString(),
          isGetBio: false
        })
      }
      else{
        this.setState({
          isGetBio: false
        })
        ToastAndroid.show(resData.messages.join(', '), ToastAndroid.SHORT);
      }
    }).catch(err => {
      this.setState({
        isGetBio: false
      })
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    })
  }
  componentDidMount()
  {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(config.COLOR);
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
      }else if (response.error) {
      }else if (response.customButton) {
      }else {
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
          if(resData.status){
            this.setState({
              // uri: config.API_HOST + '/' + resData.response.user.avatar
            })
            ToastAndroid.show('profile photo updated', ToastAndroid.SHORT)
          }
          else{
            ToastAndroid.show(resData.messages.join(', '), ToastAndroid.SHORT);
          }
        })
        .catch((err)=>{
          ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
        })
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
    this.setState({
      isLoading: true
    })
    const data = {
      name: this.state.name,
      phone_number: this.state.phoneNumber,
      bio: this.state.bio
    }
    axios.post('/users/update_profile', data)
    .then(res => {
      if(res.data.status){
        this.setState({
          isLoading: false
        })
        ToastAndroid.show('Profile updated successfully', ToastAndroid.SHORT)
        this.props.navigation.navigate('Profile')
      }
      else{
        this.setState({
          isLoading: false
        })
        ToastAndroid.show('Error occurred while updating profile', ToastAndroid.SHORT)
      }
    })
    .catch(err => {
      this.setState({
        isLoading: false
      })
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
    })
  }
  
  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        {this.state.isGetBio && <ActivityIndicator size="large" />}
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
          <Text style={{color: config.COLOR,
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
              {borderBottomColor: (this.state.isNameFocused? config.COLOR: '#000'),
              borderBottomWidth: this.state.isNameFocused? 2: 1,}]}
            onChangeText={name => this.setState({name: name,})}
            value={this.state.name}/>

        <Text style = {{color: '#737373', fontWeight: 'bold',fontSize: 16,  marginTop:35}}>YOUR BIO</Text>
          <TextInput 
            onFocus={this.handleBioFocus}
            onBlur={this.handleBioBlur}
            style={[styles.inputs, 
              {borderBottomColor: (this.state.isBioFocused? config.COLOR: '#000'),
              borderBottomWidth: this.state.isBioFocused? 2: 1,}]}
              selectionColor={config.COLOR}
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
                {borderBottomColor: (this.state.isPhoneFocused? config.COLOR: '#000'),
                borderBottomWidth: this.state.isPhoneFocused? 2: 1,} ]}
              placeholderTextColor={'#737373'}
              selectionColor={config.COLOR}
              maxLength={this.state.enterCode ? 6 : 20} />
        </View>
        <View style={{alignItems: 'center',}}>
          <Button 
            style={[styles.saveProfileBtn]}
            onPress={() => this.updateProfile()}
            mode = 'contained'
            loading = {this.state.isLoading}>
              <Text style = {{color: '#fff', fontWeight: 'bold' }} >Save profile info</Text>
          </Button> 
        </View>
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
      color: config.TEXT_COLOR,
      fontWeight: 'bold'
  },

  textInput: {
    borderBottomWidth: 2,
    padding: 0,
    flex: 1,
    fontSize: 16,
    color: config.TEXT_COLOR,
    fontWeight: 'bold'
  },

  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  callingCodeText: {
    fontSize: 16,
    color: config.TEXT_COLOR,
    fontWeight: 'bold',
    paddingRight: 10
  },

  saveProfileBtn: {
    marginTop: 60,
    borderRadius: 30,
    width: 280,
    height: 45,
    backgroundColor: config.COLOR,
    justifyContent: 'center',
  },
  })
