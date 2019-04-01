import React, { Component } from 'react'
import
{
    Text,
    View,
    StyleSheet,
    AsyncStorage,
} from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class Calendarr extends Component {

  constructor(props){
    super(props)

    this.state = {
      markedDates : [],
      chosenDate: new Date(),
    }
  }

async markSelectedDate(day)
{
  try {

    this.setState({
      chosenDate: day.dayString
    })

    await AsyncStorage.setItem('offered_ride_date', JSON.stringify(day.timestamp))
  
    this.props.navigation.navigate('TimeAndPassengersNumber')
    
  } catch (error) {
    console.log('Error in AsyncStorage ', error)
    
  }

}


  render() {
    return (
      <View style = {styles.container}>
        <Text style = {styles.goingDate}>When are you going?</Text>
      <CalendarList
        theme = {{
          todayTextColor: '#0099ff',
          selectedDayBackgroundColor: '#7963b6',
          textMonthFontWeight: 'bold',
        }}
        onDayPress = {(day) => {
          console.log('selected day', day)
          this.markSelectedDate(day)
        }}


        markedDates = {{
          [this.state.chosenDate]: {selected: true}
        }}


        onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={50}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={50}
        // Enable or disable scrolling of calendar list
        scrollEnabled={true}
        // Enable or disable vertical scroll indicator. Default = false
        showScrollIndicator={true}

        minDate = {new Date()}
        
      />

      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },

  goingDate: {
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    fontSize: 30,
    color: '#054752',
    margin: 20,
  },
})