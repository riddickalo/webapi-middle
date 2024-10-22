import Prod_Record from "../models/prod_record.mjs";
import logger from "../utils/logger.mjs";
import { Op } from "sequelize";

export async function getUtilize(ncData, time) {
    // const time = new Date();
    let retData = null;
    const periodStart = new Date(time.getTime());
    // calculate selected records range
    periodStart.setDate(periodStart.getDate() - process.env.UTILIZE_DATE_RANGE);
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
            if(record.valid_flag === 1)
                retData += record.duration;
        }

        if(records[0] && records[0].valid_flag === null) {     // 計算當前尚未結案的生產紀錄
            retData += (time.getTime() - records[0].startTime.getTime()) / 1000;
        }
        logger.debug('retData in utilize(): ', retData);  
    }).catch(err => {
        retData = err
        logger.warn('in utilize(): ', err);
    });

    if(typeof retData === 'number' && isFinite(retData)) {      // isNumber()
        // 回傳稼動率，86400 sec/day
        return Promise.resolve(Math.round(retData / (864 * process.env.UTILIZE_DATE_RANGE)));
    } else {
        return Promise.reject(retData);
    }
}