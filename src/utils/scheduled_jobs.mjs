import fs from 'fs';
import axios from 'axios';
import { __dirname } from '../config/index.mjs';

export function getDeviceEvents() {
    const startTime = '20240101-000000';
    console.log(`GET data from ${process.env.FOCAS_URL}`);
    // console.info(req);
    // await axios.get(process.env.FOCAS_URL, { params: {startTime: startTime} })
    //     .then((resp) => {
    //         console.log(resp.data);
    //         fs.writeFile('device_events.json', JSON.stringify(resp.data), {encoding: 'utf-8', flag: 'w'}, 
    //             err => console.error(err)
    //         );
    //         res.status(200).send('DONE~');
    //     }).catch((err) => {console.error(err); res.status(404).send(err);});
}