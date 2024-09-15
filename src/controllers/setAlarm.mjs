import Alarm from "../models/alarm.mjs";
import { alarmDetectHook } from "../utils/hooks.mjs";

// create an alarm record
export async function createAlarm(currData, status) {
    // currData is FOCAS format
    try{
        const ret = await Alarm.create({
                            nc_id: currData.deviceName,
                            alarm_type: status,
                            alarm_timestamp: currData.timestamp,
                        });
        // console.log(ret)
        alarmDetectHook(ret);       // send message hook
        return Promise.resolve(ret);
    } catch(err) {
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
            // console.log(ret)
            if(ret) {
                ret.history_flag = true;
                ret.save();
            }
        }).then((res) => Promise.resolve(res));
    } catch(err) {
        return Promise.reject(err);
    }
};