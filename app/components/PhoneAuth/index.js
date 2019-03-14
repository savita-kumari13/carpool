import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, DeviceEventEmitter, } from 'react-native';

import firebase from 'react-native-firebase';

import RNFirebasePhoneAuth from 'react-native-firebase-phone-auth';

export default class PhoneAuth extends Component {

    constructor(props) 
    {
        super(props);
        this.unsubscribe = null;
        this.state = 
        {
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+91',
          confirmResult: null,
        };
    }

    componentDidMount()
    {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({ user: user.toJSON() });
          } else {
            // User has been signed out, reset the state
            this.setState({
              user: null,
              message: '',
              codeInput: '',
              phoneNumber: '+91',
              confirmResult: null,
            });
          }
        });
      }

      componentWillUnmount()
      {
        if (this.unsubscribe) this.unsubscribe();
     }

      renderPhoneNumberInput()
      {
        const { phoneNumber } = this.state;
           
         return (
           <View style={{ padding: 25 }}>
             <Text>Enter phone number:</Text>
             <TextInput
               autoFocus
               style={{ height: 40, marginTop: 15, marginBottom: 15 }}
               onChangeText={value => this.setState({ phoneNumber: value })}
               placeholder={'Phone number ... '}
               value={phoneNumber}
               keyboardType = "phone-pad"
             />
             <Button title="Sign In" color="#33adff" onPress={this.signIn} />
           </View>
         );
       }

       signIn = () =>
       {
        const { phoneNumber } = this.state;
        this.setState({ message: 'Sending code ...' });
    
        // firebase.auth().signInWithPhoneNumber(phoneNumber)
        //   .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
        //   .catch(error => this.setState({ message: `Verification With Phone Number Error: ${error.message}` }));

        firebase.auth().verifyPhoneNumber(phoneNumber).on('state_changed', (phoneAuthSnapShot) =>
        {
          switch(phoneAuthSnapShot.state)
          {

            case firebase.auth.PhoneAuthState.CODE_SENT : 
              this.setState({confirmResult, message: 'Code has been sent'})
              this.renderVerificationCodeInput();
              break;

            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
              console.log('verification error');
              console.log(phoneAuthSnapshot.error);
              this.setState({message: `${phoneAuthSnapShot.error}`});
              break;

            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT :
              console.log('auto verify on android timed out');
              this.setState({confirmResult, message: 'Code has been sent'})
              break;

            case firebase.auth.PhoneAuthState.AUTO_VERIFIED :
              const { verificationId, code } = phoneAuthSnapshot;
              const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
              firebase.auth().currentUser.linkWithCredential(credential);
              break;
          }
        }, (error) => {
          console.log(error);
          console.log(error.verificationId);
        }, (phoneAuthSnapShot) => {
          if(phoneAuthSnapShot.code == null) {
            this.renderVerificationCodeInput();
          console.log(phoneAuthSnapShot);
          }
        });
      };

      renderMessage()
      {
        const { message } = this.state;
      
        if (!message.length) return null;
      
        return (
          <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
        );
      }

      renderVerificationCodeInput()
      {
        const { codeInput } = this.state;
      
        return (
          <View style={{ marginTop: 25, padding: 25 }}>
            <Text>Enter verification code below:</Text>
            <TextInput
              autoFocus
              style={{ height: 40, marginTop: 15, marginBottom: 15 }}
              onChangeText={value => this.setState({ codeInput: value })}
              placeholder={'Code ... '}
              value={codeInput}
              keyboardType = "phone-pad"
            />
            <Button title="Confirm Code" color="#33adff" onPress={this.confirmCode} />
          </View>
        );
      }

      confirmCode = () =>
      {
        const { codeInput, confirmResult } = this.state;
    
        if (confirmResult && codeInput.length)
        {
          confirmResult.confirm(codeInput)
            .then((user) => {
              this.setState({ message: 'Code Confirmed!' });
              this.props.navigation.navigate('dashboard')
            })
            .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
        }
      };




    render()
    {
        const { user, confirmResult } = this.state;


        return (
        <View style={{ flex: 1 }}>
        <Text>PhoneAuth</Text>
            { !user &&  !confirmResult && this.renderPhoneNumberInput()}

            {this.renderMessage()}

            {/* {!user && confirmResult && this.renderVerificationCodeInput()} */}

            {/* {user && (
                <View
                    style={{
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    }}
                >
                    {this.props.navigation.navigate('dashboard')}
                    
                </View>
        )} */}


        </View>
        );
    }
}
