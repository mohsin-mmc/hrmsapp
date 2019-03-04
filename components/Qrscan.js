import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/Entypo'
import { appMainBlue } from '../assets/Constants';

export default class Qrscan extends Component {

  back(){

    // console.log(this.props)
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headingView}>
          <TouchableOpacity onPress={this.back.bind(this)} style={styles.iconView}>
            <Icon name="chevron-thin-left" size={18} style={{ color: 'white' }} />
          </TouchableOpacity>
          <View style={styles.titleView}>
            <Text style={{ fontSize: 23, color: "white" }}>
              Mark Attendance
            </Text>
          </View>
          <View style={styles.iconView}>
            {/* <Icon name="bell-outline" size={25} color="white" /> */}
          </View>
        </View>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          // type={RNCamera.Constants.Type.back}
          // flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {

            this.setState({
              barcodes: barcodes
            })
          }}
        >
          <View style={styles.maskOutter}>
            <View style={styles.inner}></View>
            <View style={{ flex: 5, flexDirection: 'row' }}>
              <View style={{ flex: 1, backgroundColor: 'rgba(1,1,1,0.6)' }}>

              </View>
              <View style={{ flex: 5 }}>

              </View>
              <View style={{ flex: 1, backgroundColor: 'rgba(1,1,1,0.6)' }}>

              </View>
            </View>
            <View style={styles.inner}></View>
          </View>
        </RNCamera>

      </View>
    );
  }

  takePicture = async function () {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  inner: {
    flex: 2,
    backgroundColor: 'rgba(1,1,1,0.6)'
  },
  preview: {
    flex: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  headingView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: appMainBlue,
    // justifyContent: 'center',
    // paddingLeft: 5,
    // marginBottom: 10,
    // alignItems: 'center',
    elevation: 3,
},
titleView:{
    flex:5,
    justifyContent:'center',
    alignItems:'center'
},  
iconView:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'red'
}
});

