import fs from 'fs';
import axios from 'axios';
import Nc_Info from '../models/nc_info.mjs';
import { getOpStatus } from './translateStatus.mjs';
import { __dirname } from '../config/index.mjs';

export async function getDeviceEvents() {
    // let time = new Date();
    const queryStartTime = ((time) => {
        time.setSeconds(time.getSeconds() - Number(process.env.FOCAS_SYNC_PERIOD));
        return `${time.getFullYear()}${time.getMonth() >= 9? '': '0'}${time.getMonth()+1}`+
                `${time.getDate() >= 10? '': '0'}${time.getDate()}-${time.getHours() >= 10? '': '0'}${time.getHours()}`+
                `${time.getMinutes() >= 10? '': '0'}${time.getMinutes()}${time.getSeconds() >= 10? '': '0'}${time.getSeconds()}`; 
    });
    let startTime = queryStartTime(new Date());
    console.log(`GET data from ${process.env.FOCAS_URL} at ${startTime}`);
    // console.info(req);
    await axios.get(process.env.FOCAS_URL, { params: {startTime: startTime} })
        .then(async ({data, }) => {
            for(let row of data) {
                await Nc_Info.findOrCreate({
                    where: { nc_id: row.deviceName },
                    defaults: {
                        ncfile: row.exeProgName,
                        opStatus: getOpStatus(row),
                        nc_ip: row.hostname,
                    }
                }).then(([res, ifNew]) => {
                    if(!ifNew) {
                        res.ncfile = row.exeProgName,
                        res.opStatus = getOpStatus(row),
                        res.nc_ip = row.hostname;
                        res.save();
                    }
                }).catch((err) => console.error(err));
            }
        }).catch((err) => {console.error(err); res.status(404).send(err);});
}
// import testData from '../../device_events.json' assert {type: 'json'};
// export async function getDeviceEvents() {
//     for(let row of testData) {
//         await Nc_Info.findOrCreate({
//             where: { nc_id: row.deviceName },
//             defaults: {
//                 ncfile: row.exeProgName,
//                 opStatus: getOpStatus(row),
//                 nc_ip: row.hostname,
//             }
//         }).then(([res, ifNew]) => {
//             if(!ifNew) {
//                 res.nc_ip = row.hostname;
//                 res.save();
//             }
//         }).catch((err) => console.error(err));
//     }
// }