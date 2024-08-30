import fs from 'fs';
import axios from 'axios';
import path from 'path';

const __dirname = path.resolve();

export async function getDeviceEvents(req, res) {
    const startTime = '20240101-000000';
    console.info('GET device-events from FOCAS...');
    console.info(req);
    await axios.get(process.env.FOCAS_URL, { params: {startTime: startTime} })
        .then((resp) => {
            console.log(resp.data);
            fs.writeFile('device_events.json', JSON.stringify(resp.data), 'utf-8');
            res.status(200).send('DONE~');
        }).catch((err) => {console.error(err); res.status(404).send(err);});
}