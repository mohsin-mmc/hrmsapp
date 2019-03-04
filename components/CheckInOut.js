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
} from 'react-native';
const IMEI = require('react-native-imei');
import Icon from "react-native-vector-icons/Entypo"

import moment from "moment"
import Spinner from "react-native-loading-spinner-overlay";

import {
  creatAttendaneTable,
  DBsendData,
  DBcheckIn,
  DBcheckOut,
  sendPeriodicDatas
} from '../assets/databaseHelpers/DBhelper'
import { appMainBackgroundColor, appMainBlue } from '../assets/Constants'
import { RNCamera } from 'react-native-camera'

import BackgroundJob from 'react-native-background-job';
 
const sendPeriodicData = {
  jobKey: "sendPeriodicData",
  job: () => {
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        if (isConnected == true) {
          console.log(isConnected)
          // DBsendData();
        }else{
          console.log(isConnected)
        }
      }
    );
      let imei = IMEI.getImei()
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude
        let long = position.coords.longitude
        sendPeriodicDatas(lat,long,imei)  
      },
      error => {
        console.log("Unable to find location. Please reload.")

      },
      {
        enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
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

export default class CheckInOut extends Component {
  constructor(props) {
    super(props)
    this.state = {
      long: 0,
      lat: 0,
      loading: false,
      type: null,
      imei: 0,
      err_location: true
    }
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
        <Icon name="location-pin" size={25} style={{color: tintColor}}/>
    )
}


  async componentDidMount() {

    await request_READ_PHONE_STATE()
    await request_ACCESS_FINE_LOCATION();
    this.setState({ loading: true }) 
    this.getCord();
    this.makeTable();
    this.setTtype();
    this.sendData();
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',() => { 
        this.makeTable();
        this.setState({ loading: true }) 
        this.getCord();
        this.setTtype();
        this.sendData();
      },
      );
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
    let imei = IMEI.getImei()
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude
        let long = position.coords.longitude
        this.setState({
          lat,
          long,
          loading: false,
          imei,
          err_location: false
        })
      },
      error => {
        Alert.alert("Unable to find location. Please reload or try opening your location.")
        this.setState({
          loading: false,
          err_location: true
        })
      },
      {
        enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
      }
    );
  }

  checkIn() {
    // let imei = IMEI.getImei()
    let { lat, long, imei } = this.state
    let date = this.makeDate();
    let time = this.makeTime();

    this.setState({
      loading: true
    })

    DBcheckIn(imei, lat, long, date, time)
      .then(res => {
        AsyncStorage.setItem('type', 'checkIn');
        ToastAndroid.showWithGravity(
          'Checked In',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        this.setState({
          type: 'checkIn',
          loading: false
        })
        this.sendData();
          
        var sendPeriodicData = {
          jobKey: "sendPeriodicData",
          // allowExecutionInForeground : true,
          period: 15000,
          // exact: true,
          allowWhileIdle : true
        }
          
        BackgroundJob.schedule(sendPeriodicData);
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
  }

  checkOut() {
    // let imei = IMEI.getImei()
    let { lat, long, imei } = this.state
    let date = this.makeDate();
    let time = this.makeTime();

    this.setState({
      loading: true
    })

    DBcheckOut(imei, lat, long, date, time)
      .then(res => {
        AsyncStorage.setItem('type', 'checkOut');
        ToastAndroid.showWithGravity(
          'Checked Out',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        this.setState({
          type: 'checkOut',
          loading: false
        })
        this.sendData();
        BackgroundJob.cancel({jobKey: 'sendPeriodicData'});
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
  }

  refreshLocation(){
    this.setState({
      loading: true,
    })
    this.getCord()
  }


  render() {

    let { type, imei, lat, long, err_location } = this.state;
    return (
      <View style={styles.mainApp}>
        <Spinner
          visible={this.state.loading}
          textContent={'Requesting loaction...Please Wait'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.circleView}>
          <View style={(type == 'checkOut' || type == null) ? styles.CircleShapeView : styles.CircleShapeViewRed}>
            {/* <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              //   flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
              onGoogleVisionBarcodesDetected={({ barcodes }) => {
                console.log(barcodes);
              }}
            /> */}
            <Image style={styles.pic} source={require('../assets/images/icons.png')}/>
          </View>
        </View>
        <View style={styles.headingView}>
          <View style={styles.headingTextView}>
            <Text style={styles.headingText}>
              MMC HRMS
            </Text>
          </View >
          <View style={styles.detailTextView}>
            <Text style={styles.detailText}>Your Latitude: <Text style={{ fontWeight: 'normal' }}>{lat}</Text></Text>
            <Text style={styles.detailText}>Your Longitude: <Text style={{ fontWeight: 'normal' }}>{long}</Text></Text>
            <Text style={styles.detailText}>IMEI No: <Text style={{ fontWeight: 'normal' }}>{imei}</Text></Text>
          </View>
        </View>
        {
          (err_location == false)?

          <View style={styles.btnView}>
            {

              (type == 'checkOut' || type == null) ?
                <TouchableOpacity style={styles.checkInBtn} onPress={this.checkIn.bind(this)}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    Check in
                </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.checkOutBtn} onPress={this.checkOut.bind(this)}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    Check Out
                </Text>
                </TouchableOpacity>

            }
          </View>
          :
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.checkInBtn} onPress={this.refreshLocation.bind(this)}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({

  mainApp: {
    flex: 1,
    backgroundColor: appMainBackgroundColor,
  },
  headingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  detailTextView: {
    flex: 3,
    justifyContent: 'center',
    width: '80%',
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
  btnView: {
    flex: 1,
    alignItems: 'center',
  },
  checkInBtn: {
    backgroundColor: 'green',
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
  circleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CircleShapeView: {
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  preview: {
    flex: 1,
    width: "100%",
    height: 100,
  },

  CircleShapeViewRed: {
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  mainpic: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  pic: {
    width: 170,
    height: 170,
    borderRadius: 170 / 2,
  },

})