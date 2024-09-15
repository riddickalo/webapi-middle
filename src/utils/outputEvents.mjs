// retrive all device events
import 'dotenv/config';
import axios from "axios";
import fs from 'fs';
import path from "path";
import { __dirname } from "../config/index.mjs";

(async () => {
    try {
        const eventResp = await axios.get(process.env.FOCAS_URL);
        console.log('resp status: ', eventResp.status);
        console.log('resp config: ', eventResp.config);
        fs.writeFileSync(path.join(__dirname, 'device_events.json'), JSON.stringify(eventResp.data));
        console.log(`total written data: ${eventResp.data.length}`);
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(2);
    }
})();