import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Text,
    View,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import { appMainBackgroundColor, appMainBlue, appMainBlueDark } from '../assets/Constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionInfo: null,
            lat: '',
            long: ''
        }
    }

    login() {
        this.props.navigation.navigate('application')
    }

    render() {
        return (
            <View style={styles.mainApp}>
                <View style={styles.upperTile}>
                    <View style={styles.imageView}>
                        <Image source={require('../assets/images/logo-white.png')}/>
                    </View>
                </View>
                <View style={styles.lowerTile}>
                    <View style={styles.headingView}>
                        <Text style={{ fontSize: 35, color: appMainBlue, textAlign: 'center' }}>
                            Welcome
                        </Text>
                    </View>
                    <View style={styles.formView}>
                        <View style={styles.txtInputView}>
                            <Icon name="email-outline"  size={20}/>
                            <TextInput
                                style={styles.input}
                                placeholder='Your email address'
                            />
                        </View>
                        <View style={styles.txtInputView}>
                            <Icon name="lock-outline"  size={20}/>
                            <TextInput
                                style={styles.input}
                                placeholder='Your password'
                                secureTextEntry= {true}
                            />
                        </View>
                    </View>
                    <View style={styles.btnView}>
                        <TouchableOpacity onPress={this.login.bind(this)} style={styles.loginBtn}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, color: appMainBlue}}>
                                Login
                            </Text>
                        </TouchableOpacity>
                        <Text style={{marginTop: 10}}>
                            Forgot password?
                        </Text>
                    </View>
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
    upperTile: {
        flex: 1,
        backgroundColor: appMainBlue,
    },
    imageView:{
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    },
    headingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    formView: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    txtInputView: {
        marginVertical: 10,
        width: '90%',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        borderBottomColor: appMainBlue,
        borderBottomWidth: 2
    },
    input:{
        width:"90%",
        color: appMainBlue
    },
    btnView:{
        flex: 2,
        alignItems: 'center',
        marginTop: 5
    },
    loginBtn:{
        width: '90%',
        height: 45,
        borderRadius: 5,
        borderColor: appMainBlue,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lowerTile: {
        flex: 2,
    }
})