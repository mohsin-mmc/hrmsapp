import { openDatabase } from 'react-native-sqlite-storage';
import Axios from 'axios';
import { parseString } from 'react-native-xml2js';

var db = openDatabase({ name: 'Coordinates.db', createFromLocation: '~/Coordinates.db', location: 'Library' }, (open) => { console.log("asdasd", open) }, (e) => { console.log(e) });

export function creatAttendaneTable() {
  let query = `CREATE TABLE IF NOT EXISTS m_emp_mob(id INTEGER PRIMARY KEY AUTOINCREMENT,
        emppro_imei INTEGER,
        emppro_latitude REAL, 
        emppro_longtitude REAL,
        emppro_type TEXT,
        emppro_date TEXT,
        emppro_time TEXT);`;

  db.transaction(function (txn) {
    txn.executeSql(
      query,
      [],
      function (tx, res) {
        console.log('item:', res);
      }
    );
  });
}
export function creatCurrentMonthTable() {
  let query = `CREATE TABLE IF NOT EXISTS current_month(id INTEGER PRIMARY KEY AUTOINCREMENT,
        Early_Going INTEGER,
        Early_O_T INTEGER,
        Late_Coming INTEGER,
        Over_Time INTEGER,
        Remarks1 TEXT,
        emppro_macid INTEGER,
        emppro_name TEXT,
        in_time TEXT,
        out_time TEXT,
        tbldat_dat TEXT
        );`;

  db.transaction(function (txn) {
    txn.executeSql(
      query,
      [],
      function (tx, res) {
        console.log('currentMonth:', res);
      }
    );
  });
}

export function sendPeriodicDatas(imei, lat, long, date, time){
  return new Promise((resolve,reject)=>{

    db.transaction((txn) => {
      txn.executeSql(
        `select * from m_emp_mob where emppro_type='Check In' order by id DESC limit 1`,
        [],
        (tx, res) => {
          var rows = res.rows.raw();
          let dblat = rows[0].emppro_latitude
          let dblong = rows[0].emppro_emppro_longtitude
          if(dblat.toFixed(2) != lat.toFixed(2) && dblong.toFixed(2) != long.toFixed(2)){
            tx.executeSql(
              `insert into m_emp_mob(emppro_imei,emppro_latitude,emppro_longtitude,emppro_type,emppro_date,emppro_time) 
                values(${imei},${lat},${long},'travelling','${date}','${time}')`,
              [],
              (tx, res) => {
                if (res.rowsAffected == 1) {
                  resolve(res.rowsAffected)
                } else {
                  reject(res.rowsAffected)
                }
              }
            );
          }else{
            reject(0)
          }
  
        }
      );
    });
  })
}

export function DBsendData() {
  db.transaction((txn) => {
    txn.executeSql(
      `select * from m_emp_mob`,
      [],
      (tx, res) => {
        var rows = res.rows.raw();
        console.log(rows)

        let formData = new FormData();
        formData.append('rows', JSON.stringify(rows))
        let data = {
          method: 'POST',
          headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData
        }

        // fetch('http://192.168.0.130/example/attendanceData.php', data)
        // .then(res => res.json())
        // .then(res => {
        //   let rows_added = res.rows_added
        //   if (rows_added > 0) {
        //   //   db.executeSql('DELETE from m_emp_mob')
        // //   console('inserted')
        //   }
        // })
        // .catch(err => {
        //   console.log(err)
        // })


        for (var i = 0; i < rows.length; i++) {
          let xmls = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                            <soap:Body>
                              <checkinout_imei xmlns="http://tempuri.org/">
                                <emppro_imei>${res.rows.item(i).emppro_imei}</emppro_imei>
                                <emppro_latitude>${res.rows.item(i).emppro_latitude}</emppro_latitude>
                                <emppro_longitude>${res.rows.item(i).emppro_longtitude}</emppro_longitude>
                                <emppro_type>${res.rows.item(i).emppro_type}</emppro_type>
                                <emppro_date>${res.rows.item(i).emppro_date}</emppro_date>
                                <emppro_time>${res.rows.item(i).emppro_time}</emppro_time>
                              </checkinout_imei>
                            </soap:Body>
                          </soap:Envelope>`;

          Axios.post('https://cloud.syslinknetwork.com/att_api/webservice1.asmx?wsdl', xmls,
          {
            headers:
              { 'Content-Type': 'text/xml' }
          }).then(res => {
            console.log(res.data);
            // parseString(res.data, (err, json) => {
            //   console.log(json)
            // })
          }).catch(err => { console.log(err) });

        }
      }
    );
  });
}

export function DBcheckIn(imei, lat, long, date, time) {
  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        `insert into m_emp_mob(emppro_imei,emppro_latitude,emppro_longtitude,emppro_type,emppro_date,emppro_time) 
          values(${imei},${lat},${long},'Check In','${date}','${time}')`,
        [],
        (tx, res) => {
          if (res.rowsAffected == 1) {
            resolve(res.rowsAffected)
          } else {
            reject(res.rowsAffected)
          }
        }
      );
    });
  })
}
 
export function DBcheckOut(imei, lat, long, date, time) {
  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        `insert into m_emp_mob(emppro_imei,emppro_latitude,emppro_longtitude,emppro_type,emppro_date,emppro_time) 
            values(${imei},${lat},${long},'Check Out','${date}','${time}')`,
        [],
        (tx, res) => {
          if (res.rowsAffected == 1) {
            resolve(res.rowsAffected)
          } else {
            reject(res.rowsAffected)
          }
        });
    });
  })
}


export function InsertCurrentAttendance(rows) {

  db.executeSql(`delete from current_month`,[],(res)=>{
    for(var i=0;i< rows.length;i++){
        db.executeSql(
          `insert into current_month(Early_Going,Early_O_T,Late_Coming,Over_Time,Remarks1,emppro_macid,emppro_name,in_time,out_time,tbldat_dat) 
              values(${rows[i].Early_Going},${rows[i].Early_O_T},${rows[i].Late_Coming},${rows[i].Over_Time},'${rows[i].Remarks1}',${rows[i].emppro_macid},'${rows[i].emppro_name}','${rows[i].in_time}','${rows[i].out_time}','${rows[i].tbldat_dat}')`,
          [],
          (res) => {
            console.log(res.rowsAffected)
            if (res.rowsAffected == 1) {
              console.log(res)
            } else {

              console.log('error')
            }
          });
    }
  });
}


export function getAbsentCount(){

  return new Promise((resolve,reject)=>{

    db.executeSql(
      `select count(*) as absent from current_month where Remarks1 = '${'Absent'}'`,
      [],
      (res) => {
        let row = res.rows.raw()
        if(row.length > 0){
          resolve(row[0].absent)
        }else{
          reject('')
        }
    });
  })
}

export function getPresentCount(){
  return new Promise((resolve,reject)=>{

    db.executeSql(
      `select count(*) as present from current_month where Remarks1 <> '${'Absent'}' AND Remarks1 <> '${'Sunday'}'`,
      [],
      (res) => {
        let row = res.rows.raw()
        if(row.length > 0){
          resolve(row[0].present)
        }else{
          reject('')
        }
    });
  })
}


