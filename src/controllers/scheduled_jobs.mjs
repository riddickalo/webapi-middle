import fs from 'fs';
import axios from 'axios';
import Nc_Info from '../models/nc_info.mjs';
import { insertProd } from './setProd.mjs';
import { getUtilize } from './utilize.mjs';
import { getOpStatus } from '../utils/translateStatus.mjs';
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
                const rowStatus = getOpStatus(row);
                await Nc_Info.findOrCreate({
                    where: { nc_id: row.deviceName },
                    defaults: {
                        ncfile: row.exeProgName,
                        opStatus: rowStatus,
                        nc_ip: row.hostname,
                        running_flag: row.running,
                    }
                }).then(async ([res, ifNew]) => {
                    if(!ifNew) {
                        if(res.running_flag !== row.running) {
                            await insertProd(res, row, rowStatus);
                            res.running_flag = row.running;
                        }
                        res.ncfile = row.exeProgName,
                        res.opStatus = rowStatus,
                        res.nc_ip = row.hostname;
                        res.save();
                    }
                }).catch((err) => console.error(err));
            }
        }).catch((err) => {console.error(err); res.status(404).send(err);});
}

export async function updateUtilize() {
    await Nc_Info.findAll()
        .then(async (nc_list) => {
            const currTime = new Date();
            for (let nc of nc_list) {
                await getUtilize(nc, currTime)
                    .then((rate) => {
                        console.log(rate);
                        nc.utilize_rate = rate;
                        nc.save()
                    });
            }
        }).catch(err => console.error(err));
}

/* Test GET data */
// import testData from '../../device_events.json' assert {type: 'json'};
// export async function getDeviceEvents() {
//     for(let row of testData) {
//         const rowStatus = getOpStatus(row);
//         await Nc_Info.findOrCreate({
//             where: { nc_id: row.deviceName },
//             defaults: {
//                 ncfile: row.exeProgName,
//                 opStatus: rowStatus,
//                 nc_ip: row.hostname,
//                 running_flag: row.running,
//             }
//         }).then(async ([res, ifNew]) => {
//             if(!ifNew) {
//                 if(res.running_flag !== row.running) {
//                     await insertProd(res, row, rowStatus);
//                     res.running_flag = row.running;
//                 }
//                 res.ncfile = row.exeProgName,
//                 res.opStatus = rowStatus,
//                 res.nc_ip = row.hostname;  
//                 res.save();
//             } else {
//                 await insertProd(res, row, rowStatus, true);
//             }
//         }).catch((err) => console.error(err));
//     }
// }