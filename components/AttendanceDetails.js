import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Picker,
    TextInput,
    ScrollView
} from 'react-native';
import Icon from "react-native-vector-icons/Entypo"
import IconMa from "react-native-vector-icons/MaterialCommunityIcons"

import moment from "moment"
import Spinner from "react-native-loading-spinner-overlay";

import { appMainBackgroundColor, appMainBlue } from '../assets/Constants'

export default class AttendanceDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    componentDidMount() {

    }

    showAttendanceDetails() {

    }
    // componentWillUnmount() {
    //     this.didFocusListener.remove();
    //     alert('asdasd')
    // }

    render() {
        return (
            <View style={styles.main}>
                {/* <Spinner
          visible={this.state.loading}
          textContent={'Requesting loaction...Please Wait'}
        //   textStyle={styles.spinnerTextStyle}
        /> */}
                <View style={styles.upperTile}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('attendance')} style={styles.backArrowView}>
                        <Icon name="chevron-thin-left" size={18} style={{ color: 'white' }} />
                    </TouchableOpacity>
                    {/* <View style={styles.seprator}></View> */}
                    <View style={styles.headingView}>
                        <Text style={{ fontSize: 23, color: "white", textAlign: 'center' }}>Attendance Details</Text>
                    </View>
                </View>
                <View style={styles.lowerTile}>
                    <Text style={{ fontSize: 18, paddingLeft: 5, marginBottom: 5 }}>
                        Date: 2/20/2019
                    </Text>
                    <View style={styles.titleTileView}>
                        <View style={styles.tilesView}>
                            <IconMa name="check-circle-outline" color="white" size={30} />
                        </View>
                        <View style={styles.seprator}></View>
                        <View style={styles.tilesView}>
                            <Text style={{ fontSize: 15, color: 'white', textAlign: 'center' }}>
                                <IconMa name="close-circle-outline" color="white" size={30} />
                            </Text>
                        </View>
                        <View style={styles.seprator}></View>
                        <View style={styles.tilesView}>
                            <Text style={{ fontSize: 15, color: 'white', textAlign: 'center' }}>
                                <IconMa name="timer" size={30} color='white' />

                            </Text>
                        </View>
                    </View>
                    <View style={styles.resultView}>
                        <ScrollView style={styles.scrollView}>
                            <View style={styles.attendanceDataRow} >
                                <View style={styles.innerDataRowView}>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', color: appMainBlue }}>6 hrs</Text>
                                            <IconMa name='clock-fast' style={{ paddingLeft: 5 }} color={appMainBlue} size={25} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.attendanceDataRow} >
                                <View style={styles.innerDataRowView}>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', color: appMainBlue }}>6 hrs</Text>
                                            <IconMa name='clock-fast' style={{ paddingLeft: 5 }} color={appMainBlue} size={25} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.attendanceDataRow} >
                                <View style={styles.innerDataRowView}>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', color: appMainBlue }}>6 hrs</Text>
                                            <IconMa name='clock-fast' style={{ paddingLeft: 5 }} color={appMainBlue} size={25} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.attendanceDataRow} >
                                <View style={styles.innerDataRowView}>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', color: appMainBlue }}>6 hrs</Text>
                                            <IconMa name='clock-fast' style={{ paddingLeft: 5 }} color={appMainBlue} size={25} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.attendanceDataRow} >
                                <View style={styles.innerDataRowView}>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', color: appMainBlue }}>6 hrs</Text>
                                            <IconMa name='clock-fast' style={{ paddingLeft: 5 }} color={appMainBlue} size={25} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.attendanceDataRow} >
                                <View style={styles.innerDataRowView}>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <Text>12:00</Text>
                                    </View>
                                    <View style={styles.innerDataRowTextView}>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', color: appMainBlue }}>6 hrs</Text>
                                            <IconMa name='clock-fast' style={{ paddingLeft: 5 }} color={appMainBlue} size={25} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: appMainBackgroundColor
    },
    seprator: {
        borderWidth: 1,
        borderColor: appMainBackgroundColor
    },
    upperTile: {
        flex: 1,
        flexDirection: 'row'
    },
    backArrowView: {
        flex: 1,
        backgroundColor: appMainBlue,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3
    },
    headingView: {
        flex: 8,
        backgroundColor: appMainBlue,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3

    },
    lowerTile: {
        flex: 10,
    },
    titleTileView: {
        flex: 1,
        // backgroundColor:'red',
        flexDirection: 'row',
        paddingBottom: 5
    },
    tilesView: {
        flex: 1,
        backgroundColor: appMainBlue,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3
    },
    resultView: {
        flex: 8,
        backgroundColor: 'white'
    },
    scrollView: {

    },
    attendanceDataRow: {
        height: 50,
        backgroundColor: 'white'
    },
    innerDataRowView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        // justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        // paddingLeft: 5,
        elevation: 3
    },
    innerDataRowTextView: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
    },
    timeAdjustmentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'yellow'
    }
})