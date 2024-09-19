import Nc_Info from "../models/nc_info.mjs";
import Maintain_Item from "../models/maintain_item.mjs";
import Maintain_Record from "../models/maintain_record.mjs";
import { convertTimeFormat } from "../utils/timeFormat.mjs";

export async function getMaintainData(req, res) {
    console.log('maintain data request ', req.params);
    await retrieveMaintainData(req.params.ncId)
        .then(ret => {
            res.status(200).send(ret);
        }).catch(err => {
            if(err === 'NOT FOUND')
                res.status(400).send(err);
            else
                res.status(500).send(err);
        });
}

export async function updateMaintainData(req, res) {
    console.log('update behavior: ', req.params.behavior);
    const query = req.body;
    console.log(query)

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
    console.log(`deleted item_sn: ${req.params.itemSN}`);

    await Maintain_Item.destroy({ where: { sn: Number(req.params.itemSN) } })
            .then((num) => {
                res.status(200).send(`${num} row deleted`);
            }).catch(err => {
                console.error(err);
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
        return Promise.resolve();
    }).catch(err => {
        console.error(err);
        return Promise.reject("ERROR occurred while Updating Maintain_Item");
    });
}

async function createMaintainRecord(query) {
    try{   
        // create a Maintain_Record
        if(query.enable) {
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
                        item.status = 1;
                        await item.save();
                    });
            });
            return Promise.resolve();
        } else {
            return Promise.reject("The Maintain_Item is disabled");
        }

    } catch(err) {
        console.error(err);
        return Promise.reject("ERROR occurred while Creating Maintain_Record");
    }   
}

async function disableMaintainItem(query) {
    try{
        
    } catch(err) {
        console.error(err);
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
        // console.log(rawData)
        if(rawData && rawData.length>0) {
            rawData.map(row => {
                if(row.Maintain_Items)
                    retData.items.push(...row.Maintain_Items);
                if(row.Maintain_Records)
                    retData.records.push(...row.Maintain_Records);
            });
            return Promise.resolve(retData);

        } else {
            return Promise.reject('NOT FOUND');
        }        
    } catch(err) {
        console.error(err);
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
        return Promise.resolve(applied_row);

    } catch(err) {
        console.error(err);
        return Promise.reject('ERROR occurred while Updating Nc_Infos maintainStatus');
    }
}