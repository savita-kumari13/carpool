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
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Button} from 'react-native-paper';
import axios from '../../../axios'
import config from '../../../../config/constants'
import ImagePicker from 'react-native-image-picker'

export default class Profile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      userEmail: '',
      uri: config.API_HOST + '/user_default_profile_photo.jpg',
      phoneNumber: null,
      bio: '',
      preferences: [],
      cars: [],
      addCarShow: true,
      carList: false

    }
    this._handleBackHandler = this._handleBackHandler.bind(this);
}

signOut = async () => {
  await AsyncStorage.removeItem('id_token')
  .then(() => {
    console.log('signing out user...')
    this.props.navigation.navigate('Login')
  })
  .catch(err => console.log('error in signing out user'))
}

getProfile(){
  axios.get('/users/get_profile')
  .then(res =>{
    const resData = res.data
    if(resData && resData.response && resData.response.user)
    {
      this.setState({
        userName: resData.response.user.name,
        userEmail: resData.response.user.email,
        phoneNumber: resData.response.user.phone_number,
        preferences: resData.response.user.preferences,
        cars: resData.response.user.cars,
        uri: config.API_HOST + '/' + resData.response.user.avatar
      })
      if((resData.response.user.cars).length > 0){
        this.setState({
          addCarShow: false,
          carList: true
        })
      }
      if((resData.response.user.cars).length == 0){
        this.setState({
          addCarShow: true,
          carList: false
        })
      }
    }

  }).catch(err => {
    console.log('error sending get profile request ', err)
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
    this.getProfile();
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

 deleteCar(item){
  const car = {
    make: item.make,
    model: item.model,
    type: item.type,
    color: item.color,
    registered_year: item.registered_year
  }
   axios.post('/users/delete_car', car)
   .then(res => {
    const resData = res.data
    if(resData && resData.status){
      let cars = this.state.cars
      cars = cars.filter(car => { return car._id.toString() != item._id.toString() })
      this.setState({
        cars: cars
      })
      if(car.length == 0){
        this.setState({
          addCarShow: true,
          carList: false
        })
      }
    }
   })
   .catch(err => {
     console.log('error sending delete car request ', err)
   })
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

 renderCars = ({item}) => {
   return(
     <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginTop: 25,}}>
      <View>
        <Image
          style={styles.carIconStyle}
          source={require('../../../../../icons/suv.png')}/>
        <View style={{
          marginTop: 10,
          flexDirection: 'row',
        }}>
          <Text style={{color: '#054752',
            fontWeight: 'bold',
            fontSize: 16}}
            >{item.make}</Text>

            <Text style={{color: '#054752',
            fontWeight: 'bold',
            marginLeft: 8,
            fontSize: 16}}
            >{item.model}</Text>
        </View>

        <View style={{
          marginTop: 10,
        }}>
          <Text style={{color: '#527a7a',
            fontWeight: 'bold',
            fontSize: 16}}
          >{item.color}</Text>
        </View>
      </View>
        <TouchableOpacity style={{justifyContent: 'flex-end'}} onPress = {() => this.deleteCar(item)}>
          <Text style = {{ color: '#e60000', fontWeight: 'bold', fontSize: 13, }}>DELETE</Text>
        </TouchableOpacity>
     </View>
   )
 }

 async addCar(){ 
  await AsyncStorage.setItem('carMakeProfile', JSON.stringify(true))
  await AsyncStorage.setItem('carMakeOfferRide', JSON.stringify(false))
  this.props.navigation.navigate('CarMake')
}

  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        <SafeAreaView style= { backgroundColor = '#7963b6' }/>
          <View style={styles.header}>
            <TouchableOpacity style = {{
              alignSelf:'center',
              position: 'absolute',
              marginTop:30}}
              onPress={()=>{ this.setProfilePhoto()}}>
              <Image style={styles.avatar} source={{uri: this.state.uri }}/>
            </TouchableOpacity>
            <View style={styles.nameContent}>
              <Text style={styles.userName}>{this.state.userName}</Text>
            </View>
          </View>
          
          <View style={styles.body}>
              <Text style = {{color: '#054752', fontWeight: 'bold',fontSize: 18}}>About you</Text>
              <View style = {{paddingLeft: 45, paddingTop: 30}}>
                <Text style={{color: '#7963b6',
                  fontWeight: 'bold',
                  fontSize: 16}}
                  onPress = {() => this.props.navigation.navigate('Bio')}>Write my mini bio</Text>
                <Text style={{color: '#7963b6',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginTop: 20,}}
                  onPress = {() => this.props.navigation.navigate('Preferences')}>Add my preferences</Text>
              </View>
              <View style={{
                marginTop: 20,
                marginLeft: -20,
                marginRight: -20,
                borderBottomColor: '#cccccc',
                borderBottomWidth: 1,
              }}/>

            <Text style = {{color: '#054752', fontWeight: 'bold',fontSize: 18, marginTop: 20,}}>Account</Text>
              <View style = {{paddingLeft: 45, paddingTop: 30}}>
                <Text style={{color: '#7963b6',
                  fontWeight: 'bold',
                  fontSize: 16}}>{this.state.phoneNumber}</Text>
                <Text style={{color: '#7963b6',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginTop: 20,}}
                  onPress = {() => this.props.navigation.navigate('ChangePassword')}>Change password</Text>
              </View>
              <View style={{
                marginTop: 20,
                marginLeft: -20,
                marginRight: -20,
                borderBottomColor: '#cccccc',
                borderBottomWidth: 1,
              }}/>

            <View style = {{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,}}>
              <Text style = {{color: '#054752', fontWeight: 'bold',fontSize: 18,}}>Car</Text> 
              {this.state.carList &&
                  <Text style={{color: '#7963b6',
                    fontWeight: 'bold',
                    fontSize: 16}}
                    onPress = {() => this.props.navigation.navigate('CarMake')}>Add a car</Text>}
            </View>
            {this.state.addCarShow &&
              <View style = {{paddingLeft: 45, paddingTop: 30, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: '#7963b6',
                  fontWeight: 'bold',
                  fontSize: 16}}
                  onPress = {() => this.addCar()}>Add a car</Text>
              </View>}

            {this.state.carList &&
              <View style = {{paddingLeft: 30,}}>
                <FlatList
                  data={this.state.cars}
                  renderItem={this.renderCars}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => item._id}
                />
              </View>}
              <View style={{
                marginTop: 20,
                marginLeft: -20,
                marginRight: -20,
                borderBottomColor: '#cccccc',
                borderBottomWidth: 1,
              }}/>

        <Button 
          style={[styles.logoutButton]}
          mode = 'text'
          onPress = {() => this.signOut() }>
            <Text style = {{color: '#7963b6', fontWeight: 'bold' }}>LOG OUT</Text>
        </Button>
            
        </View>

      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
     flexGrow: 1,
  },
  header:{
    backgroundColor: "#7963b6",
    height:200,
    alignItems: 'center'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
  },

  userName: {
    fontSize: 20,
    fontWeight:'bold',
    color: '#fff',
  },

  body:{
    flex: 1,
    padding: 20,
    // backgroundColor: "#d279a6",
  },
  nameContent: {
    marginTop:140,
  },

  aboutYouText: {
    color: '#7963b6',
    fontWeight: 'bold',
    fontSize: 14
  },

  carIconStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },

  logoutButton: {
    borderRadius: 30,
    width: 300,
    height: 50,
    backgroundColor: "#fff",
    marginTop: 10,
    justifyContent: 'center'
    },

})