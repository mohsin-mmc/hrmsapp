import Axios from "axios";
import { baseUrl } from "../Constants";

export function getAttendance(from,to,imei){
    console.log(imei)
    // 358958060762371
    return new Promise((resole,reject)=>{
        Axios.get(baseUrl+`ATT_MVC_API/SSCAPI/checkatt/${imei}/${from}/${to}`)
        // Axios.get(baseUrl+`ATT_MVC_API/SSCAPI/checkatt/358958060762371/${from}/${to}`)
        .then(res =>{
            resole(res.data)
        })
        .catch(err =>{
            reject(err)
        })
    })
}