import React, { Component } from 'react';
import { Platform, StyleSheet, Styles, Image, TouchableOpacity, Alert, NetInfo, Button, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import BackgroundTask from 'react-native-background-task';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionInfo: null,
            lat: '',
            long: ''
        }
    }


    render() {
        return (
            <View style={styles.main}>

                <Image style={styles.mainApp} source={require('../assets/images/mmc-logo.png')}
                />
            </View>

        );
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainApp: {
        //   flex: 1,
        resizeMode: 'contain',
        backgroundColor: 'white',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        height: '80%',
        width: '80%',

        //   fontSize: 100, 
        //   fontWeight: 'bold',
    }
})