import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { appMainBlue } from '../../assets/Constants'

export default class MyHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false
        }
    }

    openQr() {
        let { props } = this.props
        // console.log(props)
        props.navigation.navigate('qrscan')

    }

    back() {
        let { props } = this.props
        // console.log(props)
        props.navigation.goBack()

    }


    renderModal(){
        return(
            <View style={styles.legends}>
                        <View style={{ flex: 1,justifyContent:"flex-end" }}>
                            <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>LEGENDS:</Text>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Absent =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'red', marginLeft: 5 }}></View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Present =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'green', marginLeft: 5 }}></View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>sunday =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'brown', marginLeft: 5 }}></View>
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Late =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'grey', marginLeft: 5 }}></View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Overtime =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'orange', marginLeft: 5 }}></View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Holiday =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'purple', marginLeft: 5 }}></View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 8, justifyContent:'flex-start' , alignItems:'center'}}>
                            <TouchableOpacity onPressOut={this.setModalVisible.bind(this,false)} style={{width: '90%',height:50, justifyContent:'center',alignItems:'center', backgroundColor: appMainBlue, borderRadius:5}}>
                                <Text style={{fontSize: 15, fontWeight: 'bold',color:'white'}}>
                                    Back
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
        )
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    render() {
        let { title, props } = this.props
        let { modalVisible} = this.state
        return (
            <View style={styles.headingView}>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}>         
                    {this.renderModal()}
                </Modal>
                {
                    (title == 'Dashboard') ?
                        <TouchableOpacity onPress={this.openQr.bind(this)} style={styles.iconView}>
                            <Icon name="qrcode-scan" size={25} color="white" />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this.back.bind(this)} style={styles.iconView}>
                            <Icon name="arrow-left" size={25} color="white" />
                        </TouchableOpacity>
                }
                <View style={styles.titleView}>
                    <Text style={{ fontSize: 23, color: "white" }}>
                        {title}
                    </Text>
                </View>
                {
                    (title == 'Dashboard') ?

                        <View style={styles.iconView}>
                            <Icon name="bell-outline" size={25} color="white" />
                        </View>
                        :
                        <View  style={styles.iconView}>
                            <Icon onPress={this.setModalVisible.bind(this,true)} name="help-circle-outline" size={25} color="white" />
                        </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    headingView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: appMainBlue,
        // justifyContent: 'center',
        // paddingLeft: 5,
        marginBottom: 10,
        // alignItems: 'center',
        elevation: 3,
    },
    titleView: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'red'
    },
    legends: {
        flex: 1,
        backgroundColor: 'white',
        elevation: 5
    }
})