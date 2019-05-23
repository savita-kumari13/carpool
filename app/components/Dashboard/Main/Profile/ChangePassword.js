import React, { Component } from 'react'
import { NavigationActions ,} from 'react-navigation'
import { 
  Text,
  TextInput,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native'
import { Button} from 'react-native-paper';
import axios from '../../../axios'
import config from '../../../../config/constants'

export default class ChangePassword extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         currentPassword: '',
         newPassword: '',
         confirmNewPassword: '',

         errors: {
            currentPassword: null,
            newPassword: null,
            confirmNewPassword: null,
          },

          isCurrentPasswordFocused: false,
          isNewPasswordFocused: false,
          isConfirmNewPasswordFocused: false,
    
          errorCurrentPasswordShow: false,
          errorNewPasswordShow: false,
          errorConfirmNewPasswordShow: false,
    
          errorCurrentPasswordBackgroundFocused: false,
          errorNewPasswordBackgroundFocused: false,
          errorConfirmNewPasswordBackgroundFocused: false,

          isLoading: false
      }
    }
    

  saveNewPassword(){
    this.setState({
      isLoading: true
    })
    const data = {
        current_password: this.state.currentPassword,
        new_password: this.state.newPassword,
        confirm_new_password: this.state.confirmNewPassword
    }
    axios.post('/users/change_password', data)
    .then(res => {
      let resData=res.data;
      if(!resData.status)
      {
        if(resData.response.hasOwnProperty('errors')){
          if(resData.response.errors.hasOwnProperty('current_password')){
            this.setState({
                errorCurrentPasswordShow: true,
                errorCurrentPasswordBackgroundFocused: true,
            })
          }
          if(resData.response.errors.hasOwnProperty('new_password')){
            this.setState({
                errorNewPasswordShow: true,
                errorNewPasswordBackgroundFocused: true,
            })
          }
          if(resData.response.errors.hasOwnProperty('confirm_new_password')){
            this.setState({
                errorConfirmNewPasswordShow: true,
                errorConfirmNewPasswordBackgroundFocused: true,
            })
          }
          this.setState({
          errors: {
              currentPassword: resData.response.errors.current_password,
              newPassword: resData.response.errors.new_password,
              confirmNewPassword: resData.response.errors.confirm_new_password,
            }
          })
          throw new Error(Object.values(resData.response.errors).join(', '));
        }
        else{
          ToastAndroid.show(resData.messages.join(', '),ToastAndroid.TOP, ToastAndroid.SHORT);
        }
      }
      else
      {
        this.setState({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        });
        this.props.navigation.navigate('Profile')
      }
      this.setState({
        isLoading: false
      })
  })
  .catch(err => {
    this.setState({
      isLoading: false
    })
    ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
  })
}

handleCurrentPasswordFocus = () => this.setState({ isCurrentPasswordFocused: true, errorCurrentPasswordBackgroundFocused: false})
handleCurrentPasswordBlur = () => this.setState({ isCurrentPasswordFocused: false, errorCurrentPasswordBackgroundFocused: false})

handleNewPasswordFocus = () => this.setState({ isNewPasswordFocused: true, errorNewPasswordBackgroundFocused: false})
handleNewPasswordBlur = () => this.setState({ isNewPasswordFocused: false, errorNewPasswordBackgroundFocused: false})

handleNewConfirmPasswordFocus = () => this.setState({isConfirmNewPasswordFocused: true, errorConfirmNewPasswordBackgroundFocused: false})
handleNewConfirmPasswordBlur = () => this.setState({isConfirmNewPasswordFocused: false, errorConfirmNewPasswordBackgroundFocused: false})

  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>

        <TextInput 
          onFocus={() => this.handleCurrentPasswordFocus()}
          onBlur={() => this.handleCurrentPasswordBlur()}
          placeholder='Current password'
          placeholderTextColor={'#737373'}
          style={[styles.inputs,
            {borderBottomColor: (this.state.isCurrentPasswordFocused? config.COLOR: this.state.errorCurrentPasswordBackgroundFocused? 'red': '#000'),
            borderBottomWidth: this.state.isCurrentPasswordFocused? 2: 1,}]}
            selectionColor={config.COLOR}
          onChangeText={currentPassword =>{
            this.setState({ 
              currentPassword ,
              errorCurrentPasswordShow: false,
              errorCurrentPasswordBackgroundFocused: false
            })
          }}
          value={this.state.currentPassword}/>

        {this.state.errorCurrentPasswordShow && 
        <Text style={{ color: 'red', marginTop: 10 }}>
          {this.state.errors.currentPassword}
        </Text>}

      <TextInput 
          onFocus={() => this.handleNewPasswordFocus()}
          onBlur={() => this.handleNewPasswordBlur()}
          placeholder='New password'
          placeholderTextColor={'#737373'}
          style={[styles.inputs,
            {borderBottomColor: (this.state.isNewPasswordFocused? config.COLOR: this.state.errorNewPasswordBackgroundFocused? 'red': '#000'),
            borderBottomWidth: this.state.isNewPasswordFocused? 2: 1,}]}
            selectionColor={config.COLOR}
          onChangeText={newPassword =>{
            this.setState({ 
              newPassword,
              errorNewPasswordShow: false,
              errorNewPasswordBackgroundFocused: false
            })
          }}
          value={this.state.newPassword}/>


        {this.state.errorNewPasswordShow && 
        <Text style={{ color: 'red', marginTop: 10  }}>
          {this.state.errors.newPassword}
        </Text>}

        <TextInput 
          onFocus={() => this.handleNewConfirmPasswordFocus()}
          onBlur={() => this.handleNewConfirmPasswordBlur()}
          placeholder='Confirm new password'
          placeholderTextColor={'#737373'}
          style={[styles.inputs,
            {borderBottomColor: (this.state.isConfirmNewPasswordFocused? config.COLOR: this.state.errorConfirmNewPasswordBackgroundFocused? 'red': '#000'),
            borderBottomWidth: this.state.isConfirmNewPasswordFocused? 2: 1,}]}
            selectionColor={config.COLOR}
          onChangeText={confirmNewPassword =>{
            this.setState({ 
              confirmNewPassword,
              errorConfirmNewPasswordShow: false,
              errorConfirmNewPasswordBackgroundFocused: false
            })
          }}
          value={this.state.confirmNewPassword}/>

        {this.state.errorConfirmNewPasswordShow && 
        <Text style={{ color: 'red', marginTop: 10 }}>
          {this.state.errors.confirmNewPassword}
        </Text>}

        <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 60 }}>
          <Button
              style={styles.saveNewPasswordBtn}
              onPress={() => {
                this.saveNewPassword()
              }}
              mode = "contained"
              loading = {this.state.isLoading}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }}>Save new password</Text>
          </Button> 
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  textInput: {
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#f2f2f2',
    height: 50,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  saveNewPasswordBtn:{
    borderRadius: 30,
    width: 280,
    height: 50,
    backgroundColor: config.COLOR,
    justifyContent: 'center',
  },

  inputs:{
    marginTop: 40,
    borderBottomWidth: 2,
    padding: 0,
    // flex: 1,
    fontSize: 16,
    color: config.TEXT_COLOR,
    fontWeight: 'bold'
},
})