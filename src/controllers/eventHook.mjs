import { updateDeviceEvents } from "./updateEvents.mjs";
import logger from "../utils/logger.mjs";

export async function deviceEventsHook(req, res) {
    const sync_mode = process.env.FOCAS_SYNC_MODE || 'active';
    if(sync_mode === 'passive'){
        const reqData = req.body;
        if(Symbol.iterator in Object(reqData)) {
            await updateDeviceEvents(reqData)
                .then(() => res.status(204).send())
                .catch(err => {
                    logger.info(err);
                    res.status(500).send(err);
                });
        } else {
            res.status(400).send();
        }

    } else {
        res.status(500).send('middle server is not running under passive mode');
        logger.info('middle server is not running under passive mode');
    }
}