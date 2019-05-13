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
    
          errorCurrentPasswordShow: false,
          errorNewPasswordShow: false,
          errorConfirmNewPasswordShow: false,
    
          errorCurrentPasswordBackgroundFocused: false,
          errorNewPasswordBackgroundFocused: false,
          errorConfirmNewPasswordBackgroundFocused: false,
      }
    }
    

    saveNewPassword(){
        const data = {
            current_password: this.state.currentPassword,
            new_password: this.state.newPassword,
            confirm_new_password: this.state.confirmNewPassword
        }
        axios.post('/users/change_password', data)
        .then(res => {
            console.log('res ', res)
            let resData=res.data;
            if(!resData.status)
            {
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
        else
        {
            this.setState({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
            this.props.navigation.navigate('Profile')
        }
    })
    .catch(err => {
        console.log('error sending change password request ', err)
    })
}

handleCurrentPasswordFocus = () => this.setState({ errorCurrentPasswordBackgroundFocused: false})
handleCurrentPasswordBlur = () => this.setState({errorCurrentPasswordBackgroundFocused: false})

handleNewPasswordFocus = () => this.setState({ errorNewPasswordBackgroundFocused: false})
handleNewPasswordBlur = () => this.setState({errorNewPasswordBackgroundFocused: false})

handleNewConfirmPasswordFocus = () => this.setState({ errorConfirmNewPasswordBackgroundFocused: false})
handleNewConfirmPasswordBlur = () => this.setState({errorConfirmNewPasswordBackgroundFocused: false})

  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <TextInput
        onFocus={() => this.handleCurrentPasswordFocus()}
        onBlur={() => this.handleCurrentPasswordBlur()}
          placeholder='Current password'
          value={this.state.currentPassword}
          style = {[styles.textInput, {backgroundColor : this.state.errorCurrentPasswordBackgroundFocused? '#ffe6e6': '#f2f2f2'}]}
          onChangeText={currentPassword =>{
            this.setState({ 
                currentPassword ,
                errorCurrentPasswordShow: false,
                errorCurrentPasswordBackgroundFocused: false
            })
            }} 
        />
        {this.state.errorCurrentPasswordShow && 
        <Text style={{ color: 'red', marginHorizontal: 20  }}>
          {this.state.errors.currentPassword}
        </Text>}

        <TextInput
        onFocus={() => this.handleNewPasswordFocus()}
        onBlur={() => this.handleNewPasswordBlur()}
          placeholder='New password'
          value={this.state.newPassword}
          style = {[styles.textInput, {backgroundColor : this.state.errorNewPasswordBackgroundFocused? '#ffe6e6': '#f2f2f2'}]}
          onChangeText={newPassword =>{
            this.setState({ 
                newPassword,
                errorNewPasswordShow: false,
                errorNewPasswordBackgroundFocused: false
             })
        }}
        />
        {this.state.errorNewPasswordShow && 
        <Text style={{ color: 'red', marginHorizontal: 20  }}>
          {this.state.errors.newPassword}
        </Text>}

        <TextInput
        onFocus={() => this.handleNewConfirmPasswordFocus()}
        onBlur={() => this.handleNewConfirmPasswordBlur()}
          placeholder='Confirm new password'
          value={this.state.confirmNewPassword}
          style = {[styles.textInput, {backgroundColor : this.state.errorConfirmNewPasswordBackgroundFocused? '#ffe6e6': '#f2f2f2'}]}
          onChangeText={confirmNewPassword =>{
            this.setState({ 
                confirmNewPassword,
                errorConfirmNewPasswordShow: false,
                errorConfirmNewPasswordBackgroundFocused: false
             })
        }} 
        />
        {this.state.errorConfirmNewPasswordShow && 
        <Text style={{ color: 'red', marginHorizontal: 20  }}>
          {this.state.errors.confirmNewPassword}
        </Text>}

        <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 40 }}>
          <Button
              style={styles.saveNewPasswordBtn}
              onPress={() => {
                this.saveNewPassword()
              }}
              mode = "contained">
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
        width: 200,
        height: 50,
        backgroundColor: "#7963b6",
        justifyContent: 'center',
      },
})