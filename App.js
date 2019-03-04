import { Text, View,StatusBar } from 'react-native';
import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import {appMainBlue,appMainBlueDark, appMainBackgroundColor} from './assets/Constants'
import CheckInOut from './components/CheckInOut'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Attendance from './components/Attendance'
import Qrscan from './components/Qrscan'
import AttendanceDetails from './components/AttendanceDetails';


// const Drawer = createDrawerNavigator({
//   home: {screen: Home},
//   setting: {screen: SettingsScreen},
// },{
//   drawerPosition: 'right',
//   drawerWidth: 200,
//   drawerLockMode:'unlocked'
// })

// -------------- top navigator -------------
const AppTabNavigator = createMaterialTopTabNavigator({
  checkinout: CheckInOut,
  dashboard: Dashboard,
  attendance: Attendance ,
},{
  swipeEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    labelStyle: {
      fontSize: 15,
    },
    activeTintColor: 'white',
    inactiveTintColor: appMainBackgroundColor,
    style: {
      backgroundColor: appMainBlue,
    },
    indicatorStyle :{
      backgroundColor: 'white'
    },
    tabStyle:{
      height: 45
    }
  }
}
);


// ----------------- stack navigator ---------------
const MainNavigator = createStackNavigator({
  login: {screen: Login, navigationOptions: { header: null } },
  attendancedetails: {screen: AttendanceDetails , navigationOptions:{header: null}},
  application: {screen: AppTabNavigator, navigationOptions: { header: null } }, 
  qrscan: {screen: Qrscan, navigationOptions: { header: null } }, 
});

const Apps = createAppContainer(AppTabNavigator);
// --------------------

class App extends React.Component {
  
  render() { 
    return (
      <View style={{flex:1}}>
      <StatusBar barStyle='light-content' backgroundColor={appMainBlue}></StatusBar>
      <Apps></Apps>
      {/* <Qrscan></Qrscan> */}
      {/* <CheckInOut></CheckInOut> */}
      {/* <AttendanceDetails></AttendanceDetails> */}
      {/* <Attendance></Attendance> */}
      {/* <Login></Login> */}
      {/* <Dashboard></Dashboard> */}
      </View>
    );
  }
}

export default App;
