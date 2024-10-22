import Alarm from "../models/alarm.mjs";
import { alarmDetectHook } from "../utils/hooks.mjs";
import logger from "../utils/logger.mjs";

// create an alarm record
export async function createAlarm(currData, status) {
    // currData is FOCAS format
    try{
        const ret = await Alarm.create({
                            nc_id: currData.deviceName,
                            alarm_type: status,
                            alarm_timestamp: currData.timestamp,
                        });
        logger.debug(`Alarm created: ${ret}`);
        alarmDetectHook(ret);       // send message hook
        return Promise.resolve(ret);
    } catch(err) {
        logger.info('in createAlarm()', err);
        return Promise.reject(err);
    };        
};

// close an alarm record if alarm off
export async function closeAlarm(ncInfo) {
    try {
        await Alarm.findOne({
            where: { 
                nc_id: ncInfo.nc_id,
                history_flag: false,
                alarm_type: ncInfo.opStatus,
            },
            order: [['alarm_timestamp', 'DESC']],
        }).then(async (ret) => {
            logger.debug(`Alarm to close: ${ret}`);
            if(ret) {
                ret.history_flag = true;
                ret.save();
            }
        }).then((res) => Promise.resolve(res));
    } catch(err) {
        logger.info('in closeAlarm()', err);
        return Promise.reject(err);
    }
};