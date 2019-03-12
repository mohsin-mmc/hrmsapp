import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  AsyncStorage,
  ToastAndroid,
  NetInfo,
  Image,
  AppState
} from 'react-native';
const IMEI = require('react-native-imei');
import Icon from "react-native-vector-icons/Entypo"
var PushNotification = require('react-native-push-notification');
import IconMI from "react-native-vector-icons/MaterialCommunityIcons"

import moment from "moment"
import Spinner from "react-native-loading-spinner-overlay";
import ProgressCircle from 'react-native-progress-circle'

import {
  creatAttendaneTable,
  DBsendData,
  DBcheckIn,
  DBcheckOut,
  sendPeriodicDatas,
  DBtravelData
} from '../assets/databaseHelpers/DBhelper'
import { appMainBackgroundColor, appMainBlue } from '../assets/Constants'
import { RNCamera } from 'react-native-camera'

import BackgroundJob from 'react-native-background-job';
import MyHeader from './Layouts/Header';

const sendPeriodicData = {
  jobKey: "sendPeriodicData",
  job: () => {
    let date = moment(new Date).format('YYYY-MM-DD')
    let time = moment(new Date).format('HH:mm:ss')
    let imei = IMEI.getImei()
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude
        let long = position.coords.longitude
        console.log(position)
        sendPeriodicDatas(imei, lat, long, date, time)
          .then(res => {
            console.log(res)
            PushNotification.localNotification({
              color:'red',
              message: `Different Coordinates. lat: ${lat}, long: ${long}`, 
            });
              DBsendData()
          })
          .catch(err => {
            console.log('same', err)
            PushNotification.localNotification({
              color:'red',
              message: "Same Coordinates", 
            });
          })
      },
      error => {
        console.log("Unable to find location. Please reload.")
        PushNotification.localNotification({
          color:'red',
          message: "Unable to find location", 
        });

      },
      {
        enableHighAccuracy: true, timeout: 20000 , maximumAge: 5000
      }
    );
  }
};

BackgroundJob.register(sendPeriodicData);


export async function request_READ_PHONE_STATE() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      {
        'title': 'ReactNativeCode wants to request READ_PHONE_STATE',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      AsyncStorage.setItem('phone_status', 'allowed');
    }
    else {

      AsyncStorage.setItem('phone_status', 'not allowed');

    }
  } catch (err) {
    console.warn(err)
  }
}

export async function request_ACCESS_FINE_LOCATION() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'ReactNativeCode wants to request READ_PHONE_STATE',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      AsyncStorage.setItem('phone_status', 'allowed');
    }
    else {

      AsyncStorage.setItem('phone_status', 'not allowed');

    }
  } catch (err) {
    console.warn(err)
  }
}

PushNotification.configure({
  onNotification: function(notification) {
    console.log( 'NOTIFICATION:', notification );
  },
  requestPermissions: true
})

export default class CheckInOut extends Component {
  constructor(props) {
    super(props)
    this.state = {
      long: 0,
      lat: 0,
      loading: false,
      type: null,
      imei: 0,
      err_location: false,
      per: 0,
      checkinTime: ''
    }
    this.handleAppStatechange = this.handleAppStatechange.bind(this)

  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="location-pin" size={25} style={{ color: tintColor }} />
    )
  }


  async componentDidMount() {

    await request_READ_PHONE_STATE()
    await request_ACCESS_FINE_LOCATION();
    // this.setState({ loading: true })
    // this.getCord()
    //   .then(res => {
    //     this.setState({
    //       lat: res.lat,
    //       long: res.long,
    //       loading: false,
    //       imei: res.imei,
    //       err_location: false
    //     })
    //   }).catch(err => {
    //     alert('Unable to find location.')
    //     this.setState({
    //       loading: false,
    //       err_location: true
    //     })
    //   })
    this.makeTable();
    this.setTtype();
    this.sendData();
    this.getCheckinTime()
    this.appState()
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus', () => {
        this.makeTable();
        this.setState({ loading: true })
        this.getCord()
          .then(res => {
            this.setState({
              lat: res.lat,
              long: res.long,
              loading: false,
              imei: res.imei,
              err_location: false
            })
          }).catch(err => {
            alert('Unable to find location.')
            this.setState({
              loading: false,
              err_location: true
            })
          })
        this.setTtype();
        this.sendData();
        this.getCheckinTime();
      },
    );
  }

  getCheckinTime() {
    AsyncStorage.getItem('checkinTime', (err, res) => {
      this.setState({
        checkinTime: res
      })
    })
  }


  appState(){
    AppState.addEventListener('change',this.handleAppStatechange)

  }

  componentWillUnmount() {
    console.log('asd')
    AppState.removeEventListener('change',this.handleAppStatechange)
  }

  handleAppStatechange(appState){
    if(appState == 'background'){
      

      // PushNotification.localNotification({
      //   color:'red',
      //   message: "You forgot to check out Today.Open app to check out.", 
      // });
    }else{
      console.log(appState)
    }
  }

  sendData() {

    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        if (isConnected == true) {
          DBsendData();
        }
      }
    );
  }

  setTtype() {
    AsyncStorage.getItem('type', (err, res) => {
      if (res != null) {
        this.setState({
          type: res,
        })
      }
    })
  }

  makeDate() {
    return date = moment(new Date).format('YYYY-MM-DD')
  }

  makeTime() {
    return time = moment(new Date).format('HH:mm:ss')
  }

  makeTable() {

    creatAttendaneTable();
  }

  getCord() {
    return new Promise((resolve, reject) => {
      let imei = IMEI.getImei()
      navigator.geolocation.getCurrentPosition(
        position => {
          let lat = position.coords.latitude
          let long = position.coords.longitude
          this.setState({
            lat: lat,
            long: long,
            imei: imei
          })
          resolve({ lat: lat, long: long, imei: imei })

        },
        error => {
          reject(0)

        },
        {
          enableHighAccuracy: true, timeout: 40000,maximumAge: 5000        
        }
      );

    })
  }
  // getCord() {
  //   let imei = IMEI.getImei()
  //   navigator.geolocation.getCurrentPosition(
  //     position => {
  //       let lat = position.coords.latitude
  //       let long = position.coords.longitude
  //       this.setState({
  //         lat,
  //         long,
  //         loading: false,
  //         imei,
  //         err_location: false
  //       })
  //     },
  //     error => {
  //       Alert.alert("Unable to find location. Please reload or try opening your location.")
  //       this.setState({
  //         loading: false,
  //         err_location: true
  //       })
  //     },
  //     {
  //       enableHighAccuracy: true, timeout: 20000, maximumAge: 10000
  //     }
  //   );
  // }

  checkIn() {
    // let imei = IMEI.getImei()
    let { lat, long, imei } = this.state
    let date = this.makeDate();
    let time = this.makeTime();
    let checkinTime = moment(new Date).format('hh:mm:ss a')

    this.setState({
      loading: true
    })
    this.getCord()
      .then(cords => {
        DBcheckIn(cords.imei, cords.lat, cords.long, date, time)
          .then(res => {
            AsyncStorage.setItem('type', 'checkIn');
            ToastAndroid.showWithGravity(
              'Checked In',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            AsyncStorage.setItem('checkinTime', checkinTime)
            this.setState({
              type: 'checkIn',
              loading: false,
              checkinTime: checkinTime
            })
            this.sendData();
            this.makeStart()
            // var sendPeriodicData = {
            //   jobKey: "sendPeriodicData",
            //   allowExecutionInForeground: true,
            //   // period: 900000,
            //   period: 300000,
            //   // exact: true,
            //   allowWhileIdle: true
            // }

            // BackgroundJob.schedule(sendPeriodicData);
          })
          .catch(err => {
            this.setState({
              loading: false
            })
            ToastAndroid.showWithGravity(
              'Something Went wrong..Please try again',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          });
      }).catch(err => {
        alert('Unable to find location.')
        this.setState({
          loading: false,
          err_location: true
        })
      })
  }

  checkOut() {
    // let imei = IMEI.getImei()
    let { lat, long, imei } = this.state
    let date = this.makeDate();
    let time = this.makeTime();

    this.setState({
      loading: true
    })
    this.getCord()
      .then(cords => {

        DBcheckOut(cords.imei, cords.lat, cords.long, date, time)
          .then(res => {
            AsyncStorage.setItem('type', 'checkOut');
            ToastAndroid.showWithGravity(
              'Checked Out',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            this.setState({
              type: 'checkOut',
              loading: false,
              per: 0
            })
            this.sendData();
            // BackgroundJob.cancel({ jobKey: 'sendPeriodicData' });
          })
          .catch(err => {
            this.setState({
              loading: false
            })
            ToastAndroid.showWithGravity(
              'Something Went wrong..Please try again',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          });
      })
      .catch(err => {
        alert('Unable to find location.')
        this.setState({
          loading: false,
          err_location: true
        })
      })
  }

  refreshLocation() {
    this.setState({
      loading: true,
    })
    this.getCord()
      .then(res => {
        this.setState({
          lat: res.lat,
          long: res.long,
          loading: false,
          imei: res.imei,
          err_location: false
        })
      }).catch(err => {
        alert('Unable to find location.')
        this.setState({
          loading: false,
          err_location: true
        })
      })
  }

  makeStart() {
    let interval = setInterval(() => {

      if (this.state.type == 'checkOut') {
        clearInterval(interval)
      } else {

        this.setState({
          per: this.state.per + 6.25,
          counter1: this.state.counter1 + 1
        })
      }
    }, 900000)
  }

  check(type) {
    this.setState({
      type: type,
    });
    (type == 'checkIn') ? this.checkIn() : this.checkOut()
  }

  sentTravelling(){
    this.setState({loading: true})
    let date = moment(new Date).format('YYYY-MM-DD')
    let time = moment(new Date).format('HH:mm:ss')
    let imei = IMEI.getImei()
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude
        let long = position.coords.longitude
        console.log(position)
        sendPeriodicDatas(imei, lat, long, date, time)
          .then(res => {
            console.log(res)
            PushNotification.localNotification({
              color:'red',
              message: `Different Coordinates. lat: ${lat}, long: ${long}`, 
            });
              DBsendData()
              this.setState({loading: false})
          })
          .catch(err => {
            console.log('same', err)
            PushNotification.localNotification({
              color:'red',
              message: "Same Coordinates", 
            });
            this.setState({loading: false})
          })
      },
      error => {
        console.log("Unable to find location. Please reload.")
        PushNotification.localNotification({
          color:'red',
          message: "Unable to find location", 
        });
        this.setState({loading: false})
      },
      {
        enableHighAccuracy: true, timeout: 20000 , maximumAge: 5000
      }
    );
  }


  render() {

    let { type, imei, lat, long, err_location, per, checkinTime } = this.state;
    return (
      <View style={styles.mainApp}>
        <Spinner
          visible={this.state.loading}
          textContent={'Requesting location...Please Wait'}
          textStyle={styles.spinnerTextStyle}
        />
        <MyHeader props={this.props} title='Check in/out' />

        <View style={styles.circleView}>
          <ProgressCircle
            percent={per}
            radius={120}
            borderWidth={12}
            color={appMainBackgroundColor}
            shadowColor={(type == 'checkOut') ? 'white' : 'red'}
            bgColor=
            {(type == 'checkOut' || type == null) ? 'white' : 'white'}
          >

            <TouchableOpacity style={styles.TextView} onPress={(type == 'checkOut' || type == null) ? this.check.bind(this, 'checkIn') : this.check.bind(this, 'checkOut')}  >
              <Image source={require('../assets/images/icons.png')} width="90%" height="90%"></Image>
              {/* <Text style={styles.Text}>{(type == 'checkOut' || type == null) ? 'Check In' : 'Check Out'}</Text> */}
            </TouchableOpacity>
          </ProgressCircle>

        </View>
        {
          (err_location == false) ?
            <View style={styles.btnView}>
              {

                (type == 'checkOut' || type == null) ?
                  <TouchableOpacity style={styles.checkInBtn} onPress={this.checkIn.bind(this)}>
                    <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>
                      Check in
                </Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.checkOutBtn} onPress={this.checkOut.bind(this)}>
                    <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>
                      Check Out
                </Text>
                  </TouchableOpacity>

              }
            </View>
            :
            <View style={styles.btnView}>
              <TouchableOpacity style={styles.checkOutBtn} onPress={this.refreshLocation.bind(this)}>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
        }
        <View style={styles.tileRow}>
        <View style={styles.btnView}>
        {
          (type == 'checkIn')?
              <TouchableOpacity onPress={this.sentTravelling.bind(this)} style={styles.checkInBtn}>
                  <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>
                    Place
                  </Text>
              </TouchableOpacity>
          :
          null
        }
        </View>
          <View style={styles.detailTextView}>
            <Text style={styles.detailText}>Your Latitude: <Text style={{ fontWeight: 'normal' }}>{lat}</Text></Text>
            <Text style={styles.detailText}>Your Longitude: <Text style={{ fontWeight: 'normal' }}>{long}</Text></Text>
            <Text style={styles.detailText}>IMEI No: <Text style={{ fontWeight: 'normal' }}>{imei}</Text></Text>
          </View>
          {/* <View style={styles.tileView}>
            <IconMI name="calendar-clock" size={70} color={appMainBlue} />
            <Text style={{fontSize: 18}}>
              {checkinTime}
            </Text>
            <Text style={styles.txt}>
              Last check In
                            </Text>
          </View>
          <View style={styles.tileView}>
            <IconMI name="calendar-clock" size={70} color={appMainBlue} />
            <Text style={styles.txt}>
              Total Hours
                            </Text>
          </View>
          <View style={styles.tileView}>
            <IconMI name="calendar-clock" size={70} color={appMainBlue} />
            <Text style={styles.txt}>
              Last Check In Day
                            </Text>
          </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  mainApp: {
    flex: 1,
    backgroundColor: appMainBackgroundColor,
  },
  MainheadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appMainBlue,
    //   width: 200,
    //   height: 50,
    //  marginTop: 20,
    fontWeight: 'bold',
    //   fontStyle: 'italic',
    //   lineHeight: '1.4em',
    //      fontSize: 100,
    elevation: 3,
  },
  MainheadingText: {
    textAlign: 'center',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    //        backgroundColor: 'grey',
    fontWeight: 'bold',
    //   fontStyle: 'italic',
    //   lineHeight: '1.4em',
    fontSize: 30,
    //height: 50,

  },
  headingView: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTextView: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailTextView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems:'flex-start',
    marginHorizontal: 20
  },
  detailText: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  headingText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 27,
  },
  TextView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    //  backgroundColor: 'yellow',
    flex: 1,
    fontFamily: 'Arial',
  },
  Text: {
    fontSize: 1,
    fontWeight: 'bold',
    opacity: 0.5,
    color: 'white',
    // fontStyle: 'italic',
    // fontFamily: 'Tittilium WebBold Italic',
    fontFamily: 'Arial',
  },
  btnView: {
    flex: 1,
    alignItems: 'center',
  },
  checkInBtn: {
    backgroundColor: appMainBlue,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: '90%',
    fontWeight: 'bold',
    borderRadius: 5
  },
  checkOutBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: '90%',
    fontWeight: 'bold',
    borderRadius: 5
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  view1: {
    flex: 2,
    backgroundColor: 'yellow',
  },
  view2: {
    flex: 2,
    //backgroundColor: 'green',
  },
  smallCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'blue',
    //  position: 'absolute',
    // top: 1,
    // bottom:1,
    // left: 1,
    // right:1,

  },
  circleView: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // CircleShapeView: {
  //   width: 250,
  //   height: 250,
  //   borderRadius: 250 / 2,
  //   backgroundColor: 'green',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   //marginTop: 20,
  // },
  preview: {
    flex: 1,
    width: "100%",
    height: 100,
  },

  CircleShapeViewRed: {
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    //  marginTop: 20,
  },
  mainpic: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  pic: {
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  Time: {
    fontSize: 45,
  },
  Time1: {
    marginTop: 10,
    fontSize: 20,
  },
  tileRow: {
    flex: 3,
  },
  tileView: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  txt: {
    //fontWeight: 'bold',
    fontSize: 12
  }
})