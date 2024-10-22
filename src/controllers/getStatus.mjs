import Nc_Info from "../models/nc_info.mjs";
import Alarm from "../models/alarm.mjs";
import logger from "../utils/logger.mjs";

export async function getStatus(req, res) {
    // res.status(200).send(demoData);
    await Nc_Info.findAll({ order: [['nc_id', 'ASC']] })
        .then((ret_data) => {
            res.status(200).send(ret_data);
            logger.debug('getStatus() called', ret_data);
        }).catch(({original, }) => {
            res.status(404).send(original.error);
            logger.debug('getStatus() called', original.error);
        });
}

export async function setNcAttr(req, res) { // 一次僅設定一筆
    logger.http('setNcAttr() called', req.body);

    await Nc_Info.findByPk(req.body.nc_id)
        .then(async (ret) => {
            ret.region = req.body.region;
            ret.prod_line = req.body.prod_line;
            ret.station = req.body.station;
            await ret.save().then(() => getStatus(req, res))
                            .catch(err => res.status(500).send(err));
        }).catch(err => {
            res.status(404).send(err);
            logger.debug('setNcAttr() called', err);
        });
}

export async function getAlarm(req, res) {
    try{
        let retData;
        if(req.params.type === 'current') {
            retData = await Alarm.findAll({
                where: { history_flag: false },
                order: [['alarm_timestamp', 'DESC']],
                include: [{ model: Nc_Info }],
            });
        } else if(req.params.type === 'history') {
            retData = await Alarm.findAll({
                where: { history_flag: true },
                order: [['alarm_timestamp', 'DESC']],
                include: [{ model: Nc_Info }],
            });
        }
        res.status(200).send(retData);
        logger.debug('getAlarm() called', retData);
    } catch(err) {
        logger.info('getAlarm() called', err);
        res.status(400).send(err);
    }        
}


// function createData(region, prod_line, station, nc_id, opStatus, ncfile, maintainStatus, utilize_rate) {
//     return { region, prod_line, station, nc_id, opStatus, ncfile, maintainStatus, utilize_rate };
// }

// const demoData = [
//     createData('總部', 'RG', '內溝研磨', 'GI-700-3', 'alarm', 'O999', true, 25),
//     createData('總部', 'RG', '平測磨', 'SG-500-1', 'idle', 'G100', false, 43),
//     createData('一廠', 'MG', '內溝研磨', 'GI-700-4', 'running', 'O991', true, 88),
//     createData('一廠', 'MG', '關節手臂', 'Fanuc M-800i', 'running', 'Main.tch', false, 91),
//     createData('二廠', 'EG', '裝配', 'GI-700-6', 'idle', 'O999', false, 60),
// ];