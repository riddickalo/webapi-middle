import Prod_Record from "../models/prod_record.mjs";
import { Op } from "sequelize";

export async function getUtilize(ncData, time) {
    // const time = new Date();
    let retData = null;
    const periodStart = new Date(time.getTime());
    periodStart.setDate(periodStart.getDate() - 1);
    await Prod_Record.findAll({
        where: {
            nc_id: ncData.nc_id,
            startTime: {
                [Op.gt]: periodStart,
            }
        },
        order: [['startTime', 'DESC']],
    }).then((records) => {
        retData = 0;
        for (let record of records) {
            if(record.prod_status === 1)
                retData += record.duration;
        }

        if(records[0].prod_status === null) {
            retData += (time.getTime() - records[0].startTime.getTime()) / 1000;
        }
    }).catch(err => retData = err);

    if(typeof retData === 'number' && isFinite(retData)) {
        // 回傳稼動率，86400 sec/day
        return Promise.resolve(Math.round(retData / 86400));
    } else {
        return Promise.reject(retData);
    }
}