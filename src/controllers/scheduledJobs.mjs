import fs from 'fs';
import path from 'path';
import axios from 'axios';
import Nc_Info from '../models/nc_info.mjs';
import Prod_Record from '../models/prod_record.mjs';
import { Op } from 'sequelize';
import { updateDeviceEvents } from './updateEvents.mjs';
import { getUtilize } from './utilize.mjs';
import { __dirname } from '../config/index.mjs';
import { sendLineDaily } from '../utils/lineNotify.mjs';

export async function getDeviceEvents() {
    // let time = new Date();
    const queryStartTime = ((time) => {
        time.setSeconds(time.getSeconds() - Number(process.env.FOCAS_SYNC_PERIOD));
        return `${time.getFullYear()}${time.getMonth() >= 9? '': '0'}${time.getMonth()+1}`+
                `${time.getDate() >= 10? '': '0'}${time.getDate()}-${time.getHours() >= 10? '': '0'}${time.getHours()}`+
                `${time.getMinutes() >= 10? '': '0'}${time.getMinutes()}${time.getSeconds() >= 10? '': '0'}${time.getSeconds()}`; 
    });

    try{
        let eventData = [];
        if(process.env.RUN_ENV === 'initialize') {          // sync all existed device events from FOCAS
            const axiosResp = await axios.get(process.env.FOCAS_URL);
            eventData = axiosResp.data;
        } else if(process.env.RUN_ENV === 'test') {   // import test data from .json and select data amount
            eventData = JSON.parse(fs.readFileSync(path.join(__dirname, 'device_events.json')));
            eventData = eventData.slice(0);
        } else {        // normal sync
            let startTime = queryStartTime(new Date());
            console.log(`GET data from ${process.env.FOCAS_URL} at ${startTime}`);
            // console.info(req);
            const axiosResp = await axios.get(process.env.FOCAS_URL, { params: {startTime: startTime} });
            eventData = axiosResp.data;
        }

        await updateDeviceEvents(eventData);
        return Promise.resolve();
        
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export async function updateUtilize() {
    try {
        const nc_list = await Nc_Info.findAll();
        const currTime = new Date();
        for(let nc of nc_list) {
            await getUtilize(nc, currTime).then((rate) => {
                // console.log(rate);
                nc.utilize_rate = rate;
                nc.save()
            });
        }
        return Promise.resolve();
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

export async function formDailyLineReport() {
    try{
        let currTime = new Date();
        let startRange = new Date(currTime);
        startRange.setDate(startRange.getDate() - 1);
        let results = [];

        let ncList = await Nc_Info.findAll({ 
            order: [['nc_id', 'ASC']],
            attributes: ['nc_id', 'utilize_rate'], 
        });
        let records = await Prod_Record.count({
            where: { valid_flag: 1, endTime: { [Op.lt]: currTime, [Op.gte]: startRange }},
            col: 'nc_id',
            attributes: ['nc_id'],
            group: ['nc_id'],
        });
        
        ncList.map(row => {
            const count = records.filter(record => {
                if(record.nc_id === row.nc_id) return true;
                else return false;
            })[0];
            const result = {
                nc_id: row.nc_id,
                utilize_rate: row.utilize_rate,
                prod_count: (count)? count.count: 0,
            }
            results.push(result);
        });

        sendLineDaily(results, currTime);
        return Promise.resolve();
    } catch(err) {
        return Promise.reject(err);
    }
}
