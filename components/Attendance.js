import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Picker,
    TextInput,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign"
import IconMa from "react-native-vector-icons/MaterialCommunityIcons"
import moment from "moment"
import DatePicker from 'react-native-datepicker'
import { getAttendance } from '../assets/fuctions/AttendanceFunctions'
const IMEI = require('react-native-imei');
import { appMainBackgroundColor, appMainBlue } from '../assets/Constants'
import MyHeader from './Layouts/Header';
export default class Attendance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            fromDate: '',
            toDate:'',
            attendanceData: [],
            imei: 0,
            network: false
        }
    }

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name="idcard" size={25} style={{ color: tintColor }} />
        )
    }

    componentDidMount() {
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => { 
                this.getCurrentMonthAttendance()
        })
    }

    getCurrentMonthAttendance(){
        // let {imei} = this.state
        let imei = IMEI.getImei();
        var year = moment(new Date).format('YYYY')
        var month = moment(new Date).format('MM')
        var currentDay = moment(new Date).format('MM-DD-YYYY')
        var firstDay = month+"-01-"+year;

        console.log(currentDay,firstDay)

        getAttendance(firstDay,currentDay,imei)
        .then((res) => {
            console.log(res)
            this.setState({
                // toDate: moment(currentDay).format('DD/MM/YYYY'),
                // fromDate: moment(firstDay).format('DD/MM/YYYY'),
                toDate: currentDay,
                fromDate: firstDay,
                attendanceData: res,
                network: false
            })
        })
        .catch((err) => {
            console.log(err)
            this.setState({
                network: true
            })
        })
    }

    formatDate(date){

        date = date.split("T")
        
        return moment(date[0]).format('DD/MM/YYYY')
          
    }
    formatTime(Time){
        if(Time != null){
            Time = Time.split("T")
            return Time[1]
        }else{
            return '';
        }
          
    }

    showAttendanceDetails() {
        this.props.navigation.navigate('attendancedetails')
    }
    // componentWillUnmount() {
    //     this.didFocusListener.remove();
    //     alert('asdasd')
    // }

    setToDate(date){
        let {fromDate} = this.state
        let imei = IMEI.getImei();

        this.setState({
            toDate: date
        })
        if(fromDate != ''){
            // date = moment(new Date(date)).format('MM-DD-YYYY')
            // fromDate = moment(new Date(fromDate)).format('MM-DD-YYYY')
            fromDate = fromDate.split('/')
            date = date.split('/')

            let from = fromDate[1]+'-'+fromDate[0]+'-'+fromDate[2]
            let to = date[1]+'-'+date[0]+'-'+date[2]

            this.setState({
                attendanceData: []
            })
            getAttendance(from,to,imei)
            .then(res=>{
                this.setState({
                    attendanceData: res,
                    network: false
                })
            })
            .catch(err =>{
                console.log(err)
                this.setState({
                    network: true
                })
            })
        }
    }

    setFromDate(date){
        let {toDate} = this.state
        let imei = IMEI.getImei();

        this.setState({
            fromDate: date
        })

        if(toDate != ''){
            toDate = toDate.split('/')
            date = date.split('/')

            let from = date[1]+'-'+date[0]+'-'+date[2]
            let to = toDate[1]+'-'+toDate[0]+'-'+toDate[2]
            this.setState({
                attendanceData: []
            })
            getAttendance(from,to,imei)
            .then(res=>{
                this.setState({
                    attendanceData: res,
                    network: true
                })
            })
            .catch(err =>{
                console.log(err)
                this.setState({
                    network: false
                })
            })
        }
    }

    renderCircle(remarks,Late_Coming){
        let color=''
        if(remarks == "Sunday"){
            color = 'brown'
        }else if(remarks == 'Absent'){
            color = 'red'
        }else if(remarks == null || remarks == 'Present'){
            if(remarks == null && Late_Coming > 0){
                color = 'grey'
            }else{
                color = 'green'
            }
        }
        console.log(Late_Coming)
        return <View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: color, marginRight: 5 }}></View>
    }

    render() {
        let { fromDate,toDate, attendanceData,network } = this.state

        attendanceData = attendanceData.reverse();
        return (
            <View style={styles.main}>
                {/* <Spinner
          visible={this.state.loading}
          textContent={'Requesting loaction...Please Wait'}
        //   textStyle={styles.spinnerTextStyle}
        /> */}
                <MyHeader props={this.props} title='Attendance Report' />
                <View style={styles.filterView}>
                    {/* <View style={styles.headingView}>
                        <Text style={{ fontSize: 23,color:"white",textAlign:'center' }}>
                            Attendance Report
                        </Text>
                    </View> */}
                    <View style={styles.mainInputView}>
                        <View style={styles.inputViewRow}>
                            {/* <View style={styles.inputTextView}>
                                    <Text>From:</Text>
                                </View> */}
                            <View style={styles.inputBoxView}>
                                {/* <TextInput placeholder="month" underlineColorAndroid={appMainBackgroundColor} /> */}
                                <DatePicker
                                    placeholder="From"
                                    date={fromDate}
                                    format="DD/MM/YYYY"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,
                                        }
                                    }}
                                    onDateChange={(date) => { this.setFromDate(date) }}
                                />
                            </View>
                        </View>
                        <View style={styles.seprator}></View>
                        <View style={styles.inputViewRow}>
                            {/* <View style={styles.inputTextView}>
                                    <Text>To:</Text>
                                </View> */}
                            <View style={styles.inputBoxView}>
                                <DatePicker
                                    placeholder="To"
                                    date={toDate}
                                    format="DD/MM/YYYY"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        }
                                    }}

                                    onDateChange={(date) => { this.setToDate(date) }}
                                />
                                {/* <TextInput placeholder="year" underlineColorAndroid={appMainBackgroundColor} /> */}
                            </View>
                        </View>
                    </View>
                    {/* <View style={styles.btnView}>
                            <TouchableOpacity style={styles.btn} >
                                <Text style={{color: 'white', fontSize: 15}}>
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </View> */}
                </View>
                <View style={styles.ResultView}>
                    <View style={styles.attendanceHeadingView}>
                        {/* <View style={styles.innerHeading}>
                            <Text style={styles.whiteText}>
                            <IconMa name='flag-variant-outline'  color="white" size={30}/>
                            </Text>
                        </View>
                        <View style={styles.seprator}></View> */}
                        <View style={styles.innerHeading}>
                            {/* <Text style={styles.whiteText}> 
                                Date
                            </Text> */}
                            <IconMa name="calendar-check" size={30} color='white' />
                        </View>
                        <View style={styles.seprator}></View>
                        <View style={styles.innerHeading}>
                            {/* <Text style={styles.whiteText}>
                                Total Hours
                            </Text> */}
                            <IconMa name="timer" size={30} color='white' />
                        </View>
                    </View>
                    <View style={styles.attendanceResultView}>
                        {

                            (attendanceData.length == 0) ?

                                <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                                    {
                                        (network == true)?
                                        <View>
                                            {alert('No internet connection')}
                                            <Text>
                                                No internet!
                                            </Text>
                                        </View>
                                        :
                                        <ActivityIndicator size="large" color="#0000ff" />
                                    }
                                </View>
                                :
                                <ScrollView>

                                    {
                                        attendanceData.map((row,ind) => {
                                            console.log(row)
                                            return(
                                            <TouchableOpacity key={ind} onPress={this.showAttendanceDetails.bind(this)} style={styles.attendanceDataRow} >
                                                <View style={styles.innerDataRowView}>
                                                    {/* <View style={styles.innerDataRowTextView}>
                                                            <View style={{height: 20,width:20,borderRadius:20/2,backgroundColor:'red'}}>
                                                        
                                                            </View>
                                                        </View> */}

                                                    <View style={styles.innerDataRowTextView}>
                                                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                                                            {this.renderCircle(row.Remarks1,row.Late_Coming)}
                                                            <Text style={{ fontWeight: 'bold' }}>{this.formatDate(row.tbldat_dat)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.innerDataRowTextView}>
                                                        <View style={{ flexDirection:'row',alignItems: 'center',justifyContent:'center' }}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={{marginRight: 5}}>In</Text>
                                                                <Text style={{marginRight: 5}}>{(row.in_time == null)?'null':this.formatTime(row.in_time)}</Text>
                                                            </View>
                                                            
                                                            <View style={{flex: 1}}>
                                                                <Text style={{marginLeft: 5}}>Out</Text>
                                                                <Text style={{marginLeft: 5}}>{(row.out_time == null)?'null':this.formatTime(row.out_time)}</Text>
                                                            </View>
                                                            
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            )
                                        })
                                    }

                                </ScrollView>
                        }


                    </View>
                    {/* <View style={styles.legends}>
                        <View style={{ flex: 1 }}>
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
                            </View>

                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Absent =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'red', marginLeft: 5 }}></View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Present =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'green', marginLeft: 5 }}></View>
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Absent =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'red', marginLeft: 5 }}></View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text>Present =</Text><View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: 'green', marginLeft: 5 }}></View>
                                </View>
                            </View>

                        </View>
                    </View> */}
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
    filterView: {
        flex: 1,
        // padding: 10
    },
    seprator: {
        borderWidth: 1,
        borderColor: appMainBackgroundColor
    },
    mainInputView: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'white',
        // elevation: 3
    },
    inputViewRow: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
        // flexDirection: 'row',
    },
    inputTextView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    inputBoxView: {
        flex: 2,
        justifyContent: 'center'
    },
    ResultView: {
        flex: 7,
        marginTop: 10
    },
    attendanceHeadingView: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    innerHeading: {
        flex: 1,
        backgroundColor: appMainBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3,
        paddingLeft: 5,
        elevation: 3
    },
    attendanceResultView: {
        flex: 7,
        // backgroundColor:'white'
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
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingLeft: 5,
    },
    whiteText: {
        color: 'white',
        fontSize: 18
    },
    btnView: {
        flex: 1,
        // elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
    },
    btn: {
        backgroundColor: appMainBlue,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        width: '90%',
        fontWeight: 'bold',
        borderRadius: 5
    },
    legends: {
        flex: 1,
        backgroundColor: 'white',
        elevation: 5
    }
})