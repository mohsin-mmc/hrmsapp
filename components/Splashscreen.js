import React, { Component } from 'react';
import { Platform, StyleSheet, Styles, Image, TouchableOpacity, Alert, NetInfo, Button, Text, View } from 'react-native';
import { appMainBlue } from '../assets/Constants';

export default class Splachscreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionInfo: null,
            lat: '',
            long: '',
            splash: true
        }

    }
componentDidMount(){
    setTimeout(() => {
        this.setState({splash: false})
    }, 3000);
}

    render() {

        if(this.state.splash == false){
            this.props.navigation.navigate('navigator')
        }
        return (
            <View style={styles.main}>

                <Image style={styles.mainApp} source={require('../assets/images/logo.png')}
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