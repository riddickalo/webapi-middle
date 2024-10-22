import Nc_Info from "../models/nc_info.mjs";
import Maintain_Item from "../models/maintain_item.mjs";
import Maintain_Record from "../models/maintain_record.mjs";
import { convertTimeFormat } from "../utils/timeFormat.mjs";
import logger from "../utils/logger.mjs";

export async function getMaintainData(req, res) {
    logger.http('getMaintainData request', req.params);
    await retrieveMaintainData(req.params.ncId)
        .then(ret => {
            res.status(200).send(ret);
            logger.debug('getMaintainData() called', ret);
        }).catch(err => {
            logger.info('getMaintainData() called', err);
            if(err === 'NOT FOUND')
                res.status(400).send(err);
            else
                res.status(500).send(err);
        });
}

export async function updateMaintainData(req, res) {
    logger.http('updateMaintain request', req.body);
    const query = req.body;

    try{
        if(req.params.behavior === 'update-item') {
            await updateMaintainItem(query);
        } else if(req.params.behavior === 'create-record') {
            await createMaintainRecord(query);
        } else if(req.params.behavior === 'disable-item') {
            await disableMaintainItem(query);
        } else {
            res.status(400).send('WRONG Behaivor').end();
        }
        await updateNcMaintainStatus(query.nc_id);
        await retrieveMaintainData().then(ret => res.status(200).send(ret));

    } catch(err) {
        res.status(500).send(err);
    }
}

export async function deleteMaintainItem(req, res) {
    logger.http(`deleted item_sn: ${req.params.itemSN}`);

    await Maintain_Item.destroy({ where: { sn: Number(req.params.itemSN) } })
            .then((num) => {
                logger.debug(`deleted item_sn: ${req.params.itemSN}`);
                res.status(200).send(`${num} row deleted`);
            }).catch(err => {
                logger.info(err);
                res.status(400).send(err);
            });
}

async function updateMaintainItem(query) {
    await Maintain_Item.findOrCreate({
        where: {
            nc_id: query.nc_id,
            item: query.item,
        },
        defaults: {
            period: Number(query.period),
            enable: query.enable,
        },
    }).then(async([item, isNew]) => {
        let updateFlag = false;
        if((isNew || !item.enable) && query.enable) { // set check schedule time
            const scheduledTime = new Date();
            scheduledTime.setDate(scheduledTime.getDate() + Number(query.period));
            console.log(scheduledTime);
            item.scheduled_check_time = scheduledTime;
            item.status = 1;
            updateFlag = true;
        } else if(item.period !== query.period && query.enable) { // update schedule time by period
            const delta_date = Number(query.period) - item.period;
            const new_time = new Date(item.scheduled_check_time);
            new_time.setDate(new_time.getDate() + delta_date);
            item.scheduled_check_time = new_time;
            updateFlag = true;
        }
        
        if(!isNew) { // update item info
            item.item = query.item;
            item.period = Number(query.period);
            item.enable = query.enable;
            updateFlag = true;
        }

        if(updateFlag) await item.save();
        logger.debug('in updateMaintainItem(), queried item: ', query, 'updated item: ', item);
        return Promise.resolve();
    }).catch(err => {
        logger.info('in updateMaintainItem() ', err);
        return Promise.reject("ERROR occurred while Updating Maintain_Item");
    });
}

async function createMaintainRecord(query) {
    try{   
        // create a Maintain_Record
        if(query.status > 0) {
            await Maintain_Record.create({
                item: query.item,
                nc_id: query.nc_id,
                worker: 'Admin',
                scheduled_check_time: query.scheduled_check_time,
                actual_check_time: new Date(),
            }).then(async newRecord => {
                // updata item info
                await Maintain_Item.findByPk(Number(query.sn))
                    .then(async item => {
                        item.last_check_time = newRecord.actual_check_time;
                        if(query.enable) {
                            const newScheduleTime = new Date();
                            newScheduleTime.setDate(newScheduleTime.getDate() + Number(query.period));
                            item.scheduled_check_time = newScheduleTime;
                            item.status = 1;
                        } else {
                            item.status = 0;
                        }
                        await item.save();
                        logger.debug('in createMaintainRecord(), queried item: ', item, 'new record: ', newRecord);
                    });
            });
            return Promise.resolve();
        } else {
            return Promise.reject("The Maintain_Item is disabled");
        }

    } catch(err) {
        logger.info('in createMaintainRecord() ', err);
        return Promise.reject("ERROR occurred while Creating Maintain_Record");
    }   
}

async function disableMaintainItem(query) {
    try{
        
    } catch(err) {
        logger.info(err);
        return Promise.reject("ERROR occurred while Disabling Maintain_Item");
    }
}

// retrieve all maintain data and return them in format
async function retrieveMaintainData(request='all') {   
    try{
        let retData = { items: [], records: [], };
        let rawData;
        if(request === 'all') {
            rawData = await Nc_Info.findAll({
                            include: [{ model: Maintain_Item }, { model: Maintain_Record }],
                        });
        } else {
            rawData = await Nc_Info.findAll({
                where: { nc_id: request },
                include: [{ model: Maintain_Item }, { model: Maintain_Record }],
            });
        }
        if(rawData && rawData.length>0) {
            rawData.map(row => {
                if(row.Maintain_Items)
                    retData.items.push(...row.Maintain_Items);
                if(row.Maintain_Records)
                    retData.records.push(...row.Maintain_Records);
            });
            logger.debug('in retrieveMaintainData() ', retData);
            return Promise.resolve(retData);

        } else {
            return Promise.reject('NOT FOUND');
        }        
    } catch(err) {
        logger.info('in retrieveMaintainData() ', err);
        return Promise.reject(err);
    }
}

export async function updateNcMaintainStatus(NcId) {
    try{
        let statusList = [];
        await Maintain_Item.findAll({
            where: { nc_id: NcId, enable: true },
            attributes: ['status'],
        }).then(async(rawList) => {
            if(rawList) {
                rawList.forEach(element => statusList.push(element.status));
            }
        });
        const status = (statusList.length > 0)? Math.max(...statusList): 0;
        const applied_row = await Nc_Info.update({ maintainStatus: status }, { where: { nc_id: NcId } });
        logger.debug('in updateNcMaintainStatus(), applied row: ', applied_row, 'statusList: ', statusList);
        return Promise.resolve(applied_row);

    } catch(err) {
        logger.info(err);
        return Promise.reject('ERROR occurred while Updating Nc_Infos maintainStatus');
    }
}