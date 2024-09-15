import Nc_Info from "../models/nc_info.mjs";
import Alarm from "../models/alarm.mjs";
import { updateProd } from "./setProd.mjs";
import { createAlarm, closeAlarm } from "./setAlarm.mjs";
import { getOpStatus } from "../utils/translateStatus.mjs";

export async function updateDeviceEvents(eventData) {
    try{
        for(let row of eventData) {
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
                    // listen running flag
                    if(res.running_flag !== row.running) {
                        await updateProd(rowStatus, row, res);
                        res.running_flag = row.running;
                    }
                    // listen alarm & emergency status
                    if((row.alarm === 1 && res.opStatus !== 'alarm') || 
                        (row.emergency === 1 && res.opStatus !== 'warning')) {
                            await createAlarm(row, rowStatus);
                    }
                    if((row.alarm === 0 && res.opStatus === 'alarm') || 
                        (row.emergency === 0 && res.opStatus === 'warning')) {
                            await closeAlarm(res);
                    }

                    res.ncfile = row.exeProgName,
                    res.opStatus = rowStatus,
                    res.nc_ip = row.hostname;
                    res.save();
                } else if(ifNew && rowStatus === 'running') {
                    await updateProd(rowStatus, row);
                }
            });
        }

        return Promise.resolve();
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}