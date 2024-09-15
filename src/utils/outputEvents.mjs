// retrive all device events
import axios from "axios";
import fs from 'fs';
import path from "path";
import { __dirname } from "../config/index.mjs";

(async () => {
    const eventData = await axios.get(process.env.FOCAS_URL);
    fs.writeFileSync(path.join(__dirname, 'device_events.json'), JSON.stringify(eventData));
    process.exit();
})();