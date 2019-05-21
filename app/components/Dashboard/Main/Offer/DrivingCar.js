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
  ActivityIndicator,
} from 'react-native'
import axios from '../../../axios'
import { Button} from 'react-native-paper';
import config from '../../../../config/constants'
import ArrowIcon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage'

export default class DrivingCar extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         cars: [],
         hasCars: false,
         addNewCar: false,
         isLoading: false,
         isLoadingCars: false,
      }
    }

    componentDidMount(){
        this.setState({
            isLoadingCars: true
        })
        axios.get(`/users/has_car`)
        .then(res => {
            const resData = res.data
            if(resData.status){
                if(resData && resData.response && (resData.response.cars.length > 0)){
                    this.setState({
                        cars: resData.response.cars,
                        hasCars: true,
                        addNewCar: false,
                        isLoadingCars: false
                    })
                }
                if(resData && resData.response && (resData.response.cars.length == 0)){
                    this.setState({
                        cars: resData.response.cars,
                        hasCars: false,
                        addNewCar: true,
                        isLoadingCars: false
                    })
                }
                this.setState({
                    isLoadingCars: false
                })
            }
            else{
                this.setState({
                    isLoadingCars: false
                })
            }
        })
        .catch(err => {
            this.setState({
                isLoadingCars: false
            })
            console.log('error sending has car request ', err)
            ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
        })
    }

    async saveCar(item){
        try {
            await AsyncStorage.setItem('car', JSON.stringify(item))
            this.props.navigation.navigate('TimeAndPassengersNumber')      
        }
        catch (error) {
            console.log('Error in AsyncStorage ', error)
            ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
        }
    }

    renderCars = ({item}) => {
        return(
            <TouchableOpacity style = {{marginTop: 20,}} onPress = {() => this.saveCar(item)}>
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    }}>
                    <Text style={{color: config.TEXT_COLOR,
                        fontWeight: 'bold',
                        fontSize: 16}}
                        >{item.make}</Text>
            
                        <Text style={{color: config.TEXT_COLOR,
                        fontWeight: 'bold',
                        marginLeft: 8,
                        fontSize: 16}}
                        >{item.model}</Text>
                    </View>
                    <ArrowIcon name = 'ios-arrow-forward' size = {20} color = {'#999999'} style={{marginTop: 15, marginRight: 10,}}/>
                </View>
                <View style={{
                        marginTop: 20,
                        marginLeft: -20,
                        marginRight: 8,
                        borderBottomColor: '#cccccc',
                        borderBottomWidth: 1,
                }}/>
          </TouchableOpacity>
        )
      }
     
    async addCar(){ 
        this.setState({
            isLoading: true
        })
        try{
            await AsyncStorage.setItem('carMakeOfferRide', JSON.stringify(true))
            await AsyncStorage.setItem('carMakeProfile', JSON.stringify(false))
            this.props.navigation.navigate('CarMake')
            this.setState({
                isLoading: false
            })
        }
        catch (error) {
            this.setState({
                isLoading: false
            })
            console.log('Error in AsyncStorage ', error)
            ToastAndroid.show('Unknown error occurred', ToastAndroid.SHORT)
          }
    }
    
  render() {
    return (
        <ScrollView contentContainerStyle = {styles.container}>
        {this.state.isLoadingCars && <ActivityIndicator size="large" />}
        {this.state.hasCars &&
        <View>
            <Text style = {styles.drivingCar}>Which car are you driving?</Text>
            <View style = {{marginTop: 20,}}>
            <FlatList
                data={this.state.cars}
                renderItem={this.renderCars}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item._id}
            />
            </View>
        </View>}

        {this.state.addNewCar &&
        <View>
            <Text style = {[styles.drivingCar]}>Which car are you driving?</Text>
            <View style={{alignItems: 'center',}}>
                <Button 
                style={[styles.addCarBtn]}
                onPress={() => this.addCar()}
                mode = 'contained'
                loading = {this.state.isLoading}>
                    <Text style = {{color: '#fff', fontWeight: 'bold' }} >Add car</Text>
                </Button> 
            </View>
        </View>}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
     },

     drivingCar: {
        fontWeight: 'bold',
        fontFamily: "sans-serif-medium",
        fontSize: 28,
        fontWeight: 'bold',
        color: config.TEXT_COLOR,
        marginTop: 20,
      },

      addCarBtn: {
        marginTop: 60,
        borderRadius: 30,
        width: 300,
        height: 45,
        backgroundColor: config.COLOR,
        justifyContent: 'center',
      },
})
