import React, { Component } from 'react'
import { 
  Text,
  View ,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ToastAndroid
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons';
import { Button } from 'react-native-paper'
import axios from '../../../axios'
import AsyncStorage from '@react-native-community/async-storage'
import config from '../../../../config/constants'

export default class CarMake extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      carMakeText: '',
      carModelText: '',
      carTypeName: '',
      carColor: '',
      registeredYear: null,

      yearError: '',
      yearErrorShow: false,

      showMakeText: true,
      showModelText: false,

      showPopularMakes: true,
      showPopularModels: false,

      showModelMaruti: false,
      showModelHonda: false,
      showModelHyundai: false,
      showModelFord: false,
      showModelTata: false,

      showContinueButton: false,
      showSubmitButton: false,
      
      showCarType: false,
      showColors: false,
      showRegistration: false,

      isLoading: false,

      popularMake: ['HONDA', 'HYUNDAI', 'TATA', 'FORD', 'MARUTI',],
      popularModelMaruti: ['Wagon R', 'Swift', 'SWIFT DZIRE', 'ALTO 800', '1000',],
      popularModelHyundai: [ 'ACCENT', 'i30', 'i20', 'SOLARIS', 'GETZ'],
      popularModelHonda: [ 'ACCORD',  'JAZZ','CIVIC', 'CR-V', 'City'],
      popularModelFord: ['FOCUS', 'FISTA', 'MONDEO', 'C-MAX', 'TRANSIT'],
      popularModelTata: ['VISTA', 'INDICA', 'INDIGO', 'Manza', 'ZEST'],
      carTypes: ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Minivan', 'Van'],
      colors: ['Black', 'White', 'Red', 'Burgundy', 'Grey', 'Dark blue', 'Blue', 'Brown', 'Beige', 'Dark green', 'Green', 'Purple', 'Yellow', 'Orange', 'Pink']

    }
  }

  renderPopularMake = ({item}) => {
    return(
      <TouchableOpacity onPress ={() => {
        this.setState({
          carMakeText: item,
          showModelText: true,
          showPopularModels: true,
        })
        if(item == 'MARUTI')
        this.setState({
          showModelMaruti: true,
          showModelHonda: false,
          showModelHyundai: false,
          showModelFord: false,
          showModelTata: false,
          carModelText: '',
        })
        else if(item == 'HONDA')
        this.setState({
          showModelMaruti: false,
          showModelHonda: true,
          showModelHyundai: false,
          showModelFord: false,
          showModelTata: false,
          carModelText: '',
        })
        else if(item == 'HYUNDAI')
        this.setState({
          showModelMaruti: false,
          showModelHonda: false,
          showModelHyundai: true,
          showModelFord: false,
          showModelTata: false,
          carModelText: '',
        })
        else if(item == 'FORD')
        this.setState({
          showModelMaruti: false,
          showModelHonda: false,
          showModelHyundai: false,
          showModelFord: true,
          showModelTata: false,
          carModelText: '',
        })
        else if(item == 'TATA')
        this.setState({
          showModelMaruti: false,
          showModelHonda: false,
          showModelHyundai: false,
          showModelFord: false,
          showModelTata: true,
          carModelText: '',
        })
      }}>
        <Text style = {styles.popularMakeName}>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderPopularModelMaruti = ({item}) => {
    return(
      <TouchableOpacity onPress ={() => {
        this.setState({
          carModelText: item,
          showContinueButton: true
        })}}>
        <Text style = {styles.popularMakeName}>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderPopularModelHonda = ({item}) => {
    return(
      <TouchableOpacity onPress ={() => {
        this.setState({
          carModelText: item,
          showContinueButton: true
        })}}>
        <Text style = {styles.popularMakeName}>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderPopularModelHyundai = ({item}) => {
    return(
      <TouchableOpacity onPress ={() => {
        this.setState({
          carModelText: item,
          showContinueButton: true
        })}}>
        <Text style = {styles.popularMakeName}>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderPopularModelFord = ({item}) => {
    return(
      <TouchableOpacity onPress ={() => {
        this.setState({
          carModelText: item,
          showContinueButton: true
        })
        console.log('ford model ',this.state.carModelText)}}>
        <Text style = {styles.popularMakeName}>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderPopularModelTata = ({item}) => {
    return(
      <TouchableOpacity onPress ={() => {
        this.setState({
          carModelText: item,
          showContinueButton: true
        })}}>
        <Text style = {styles.popularMakeName}>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderCarTypes = ({item}) => {
    let carIcon
    if(item == 'Sedan'){
      carIcon = <Image
        style={styles.carIconStyle}
        source={require('../../../../../icons/sedan.png')}/>
    }
    else if(item == 'SUV'){
      carIcon = <Image
        style={styles.carIconStyle}
        source={require('../../../../../icons/suv.png')}/>
    }
    else if(item == 'Hatchback'){
      carIcon = <Image
        style={styles.carIconStyle}
        source={require('../../../../../icons/hatchback.png')}/>
    }
    else if(item == 'Minivan'){
      carIcon = <Image
        style={styles.carIconStyle}
        source={require('../../../../../icons/mini_van.png')}/>
    }
    else if(item == 'Van'){
      carIcon = <Image
        style={styles.carIconStyle}
        source={require('../../../../../icons/van.png')}/>
    }
    else if(item == 'Convertible'){
      carIcon = <Image
        style={styles.carIconStyle}
        source={require('../../../../../icons/convertible.png')}/>
    }
    return(
      <TouchableOpacity style = {{flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', alignItems: 'center', }} 
        onPress = {() => {
          this.setState({
            carTypeName: item,
            showColors: true,
            showCarType: false,
          })
      }}>
        <TouchableOpacity style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
          {carIcon}
          <Text style = {{fontWeight: 'bold',
            fontFamily: 'sans-serif-medium',
            fontSize: 16,
            color: config.TEXT_COLOR,
            marginLeft: 20,
            marginTop: 10,
            }}
            onPress = {() => {
              this.setState({
                carTypeName: item,
                showColors: true,
                showCarType: false,
              })
            }}>{item}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderColors = ({item}) => {
    let colorIcon
    if(item == 'Black'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: '#000',}}></View>
    }
    else if(item == 'White'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: '#fff',}}></View>
    }
    else if(item == 'Burgundy'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: '#800000',}}></View>
    }
    else if(item == 'Red'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'red',}}></View>
    }
    else if(item == 'Dark blue'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: '#00004d',}}></View>
    }
    else if(item == 'Blue'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: '#0000cc',}}></View>
    }
    else if(item == 'Dark green'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: '#003300',}}></View>
    }
    else if(item == 'Green'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'green',}}></View>
    }
    else if(item == 'Brown'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'brown',}}></View>
    }
    else if(item == 'Beige'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'beige',}}></View>
    }
    else if(item == 'Orange'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'orange',}}></View>
    }
    else if(item == 'Yellow'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'yellow',}}></View>
    }
    else if(item == 'Purple'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'purple',}}></View>
    }
    else if(item == 'Pink'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'pink',}}></View>
    }
    else if(item == 'Grey'){
      colorIcon = <View style = {{
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: 'grey',}}></View>
    }
    return(
      <TouchableOpacity style = {{flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', alignItems: 'center',}}
        onPress = {() => {
          this.setState({
            carColor: item,
            showColors: false,
            showRegistration: true,
          })
        }}>
        <TouchableOpacity style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
          {colorIcon}
          <Text style = {{fontWeight: 'bold',
            fontFamily: 'sans-serif-medium',
            fontSize: 16,
            color: config.TEXT_COLOR,
            marginLeft: 20,
            }}
            onPress = {() => {
              this.setState({
                carColor: item,
                showColors: false,
                showRegistration: true,
              })
            }}>{item}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

async checkRegisteredYear(){
  this.setState({
    isLoading: true
  })
  const currentYear = new Date().getFullYear()
  const lastFiftyYears = currentYear - 50
  if(this.state.registeredYear >= lastFiftyYears && this.state.registeredYear <= currentYear){
    this.setState({
      yearErrorShow: false,
      isLoading: false
    })
    const car = {
      make: this.state.carMakeText,
      model: this.state.carModelText,
      type: this.state.carTypeName,
      color: this.state.carColor,
      registered_year: this.state.registeredYear
    }

    try {
      this.setState({
        isLoading: true
      })
      const directedFromOfferRide = JSON.parse(await AsyncStorage.getItem('carMakeOfferRide'))
      const directedFromProfile = JSON.parse(await AsyncStorage.getItem('carMakeProfile'))

      await AsyncStorage.setItem('car', JSON.stringify(car))

      await axios.post('/users/add_car', car )
      .then(res => {
        const resData = res.data
        if(resData.status){
          if(directedFromOfferRide && !directedFromProfile){
            this.setState({
              isLoading: false
            })
            this.props.navigation.navigate('TimeAndPassengersNumber')
            return
          }
          if(directedFromProfile && !directedFromOfferRide){
            this.setState({
              isLoading: false
            })
            this.props.navigation.navigate('Profile')
            ToastAndroid.show('Car saved successfully', ToastAndroid.SHORT)
            return
          }
        }
        else{
          this.setState({
            isLoading: false
          })
          ToastAndroid.show('Error occurred while saving car details', ToastAndroid.SHORT)
        }
      }).catch(err => {
        this.setState({
          isLoading: false
        })
        console.log('Error sending add car request ', err)
        ToastAndroid.show('Error occurred while updating profile photo', ToastAndroid.SHORT)
      })
    } catch (error) {
      this.setState({
        isLoading: false
      })
      console.log('Error in AsyncStorage ', error) 
      ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT) 
    }
  }
  else{
    this.setState({
      yearErrorShow: true,
      yearError: 'Please enter a valid year',
      isLoading: false
    })
  }
}

  
  render() {
    return (
      <ScrollView contentContainerStyle = {styles.container}>
        {this.state.showMakeText &&
        <Text style = {styles.makeCar}> What make is your car? </Text>}
        {this.state.showMakeText &&
        <View style = {{ marginTop: 50, marginLeft: 20, flexDirection: 'row', justifyContent: 'space-between',}}>
          <Icon name = "search" 
                size = {35} color= {config.TEXT_COLOR}
                style = {{marginTop:15, }}/>
          <TextInput
            placeholder='Car make'
            value={this.state.carMakeText}
            style = {styles.textInput}
            onChangeText={carMakeText =>{
            this.setState({ carMakeText, showModelText: true })}}/>
        </View>}

        {this.state.showPopularMakes &&
        <View style = {{marginTop: 70,}}>
          <Text style = {styles.popularMakes}> Popular makes </Text>
          <FlatList
            data={this.state.popularMake}
            renderItem={this.renderPopularMake}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item}
          />
        </View>}

      {this.state.showModelText &&  
      <Text style = {{fontWeight: 'bold',
        fontFamily: 'sans-serif-medium',
        fontSize: 18,
        color: config.TEXT_COLOR,
        marginTop: 70,
        }}> What model? </Text>}
        
        {this.state.showModelText &&  
        <View style = {{ marginTop: 50, marginLeft: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Icon name = "search" 
                size = {35} color= {config.TEXT_COLOR}
                style = {{marginTop:15, }}/>
          <TextInput
            placeholder='Car model'
            value={this.state.carModelText}
            style = {styles.textInput}
            onChangeText={carModelText =>{
            this.setState({ carModelText, showContinueButton: true })}}/>
        </View>}

        {this.state.showPopularModels &&  
        <View style = {{marginTop: 70,}}>
          <Text style = {styles.popularMakes}> Popular models </Text>
          {this.state.showModelMaruti &&
          <FlatList
            data={this.state.popularModelMaruti}
            renderItem={this.renderPopularModelMaruti}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item}
          />}

          {this.state.showModelHonda &&
          <FlatList
            data={this.state.popularModelHonda}
            renderItem={this.renderPopularModelHonda}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item}
          />}

          {this.state.showModelHyundai &&
          <FlatList
            data={this.state.popularModelHyundai}
            renderItem={this.renderPopularModelHyundai}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item}
          />}

          {this.state.showModelFord &&
          <FlatList
            data={this.state.popularModelFord}
            renderItem={this.renderPopularModelFord}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item}
          />}

          {this.state.showModelTata &&
          <FlatList
            data={this.state.popularModelTata}
            renderItem={this.renderPopularModelTata}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item}
          />}
        </View>}

        {this.state.showContinueButton &&
        <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 40 }}>
          <Button
              style={styles.continueBtn}
              onPress={() => {
                this.setState({
                  showMakeText: false,
                  showModelText: false,
                  showPopularMakes: false,
                  showPopularModels: false,
                  showCarType: true,
                  showContinueButton: false,
                })
              }}
              mode = "contained">
              <Text style = {{color: '#fff', fontWeight: 'bold' }}>Continue</Text>
          </Button> 
        </View>}

      {this.state.showCarType &&
      <Text style = {styles.makeCar}> What type of car is it? </Text>}

      {this.state.showCarType &&
      <View style = {{marginTop: 25,}}>
        <FlatList
          data={this.state.carTypes}
          renderItem={this.renderCarTypes}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item}
        />
      </View>}

    {this.state.showColors &&
    <Text style = {styles.makeCar}> What colour is it? </Text>}

    {this.state.showColors &&
      <View style = {{marginTop: 25,}}>
        <FlatList
          data={this.state.colors}
          renderItem={this.renderColors}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item}
        />
      </View>}

      {this.state.showRegistration &&
      <View style = {{marginTop: 10,}}>
        <Text style = {styles.makeCar}> What year was it registered? </Text>
        <Text style = {styles.registrationText}>Passengers like to know if your car is modern or something a bit more vintage. </Text>
      </View>}

      {this.state.showRegistration &&
      <TextInput
        placeholder='Enter year (YYYY)'
        value={this.state.registeredYear}
        keyboardType = "phone-pad"
        style = {{justifyContent: 'center',
          borderBottomWidth: 2,
          borderBottomColor: config.COLOR,
          height: 50,
          width: 300,
          marginTop: 90,
          marginLeft: 10,
          padding: 0,
          fontSize: 16,
          color: config.TEXT_COLOR,
          fontWeight: 'bold'}}
          onChangeText={registeredYear =>{
            this.setState({ 
              registeredYear, 
              showSubmitButton: true, 
              yearErrorShow: false 
            })
            if(registeredYear == ''){
              this.setState({
                showSubmitButton: false
              })
            }
          }}/>}

      {this.state.showRegistration && this.state.yearErrorShow &&
      <Text style={{ color: 'red', marginHorizontal: 10, marginTop: 10  }}>
      {this.state.yearError}
      </Text>}

      {this.state.showSubmitButton &&
        <View style = {{alignItems: 'center',justifyContent: 'center', marginTop: 40 }}>
          <Button
              style={styles.continueBtn}
              onPress={() => {
                this.checkRegisteredYear()
              }}
              mode = "contained"
              loading = {this.state.isLoading}>
            <Text style = {{color: '#fff', fontWeight: 'bold' }}>Submit</Text>
          </Button> 
        </View>}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
     flexGrow: 1,
     padding: 20,
     marginTop: 10
  },

  makeCar: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    color: config.TEXT_COLOR,
  },

  registrationText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#527a7a',
    marginTop: 10,
    marginLeft: 7,
  },

  popularMakes: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    color: config.TEXT_COLOR,
  },

  popularMakeName: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    fontSize: 16,
    color: config.COLOR,
    marginTop: 20,
    marginHorizontal: 40,
  },

  textInput: {
    justifyContent: 'center',
    borderBottomColor: config.TEXT_COLOR,
    height: 50,
    width: 240,
    marginRight: 10,
    paddingTop: 20,
    borderBottomWidth: 2,
    padding: 0,
    fontSize: 16,
    color: config.TEXT_COLOR,
    fontWeight: 'bold'
  },

  continueBtn:{
    borderRadius: 30,
    width: 250,
    height: 45,
    backgroundColor: config.COLOR,
    justifyContent: 'center',
  },

  carIconStyle: {
    marginTop: 10,
    width: 30,
    height: 30,
    marginLeft: 10,
  }
})
