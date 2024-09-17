import Nc_Info from "../models/nc_info.mjs";
import Maintain_Item from "../models/maintain_item.mjs";
import Maintain_Record from "../models/maintain_record.mjs";
import { convertTimeFormat } from "../utils/timeFormat.mjs";

export async function getMaintainData(req, res) {
    console.log('maintain data request ', req.params);
    await formMaintainData(req.params.ncId)
        .then(ret => {
            res.status(200).send(ret);
        }).catch(err => {
            if(err === 'NOT FOUND')
                res.status(400).send(err);
            else
                res.status(500).send(err);
        });
}

export async function updateMaintainItem(req, res) {
    console.log('update maintain item ', req.body);
    const query = req.body;

    await Maintain_Item.findOrCreate({
        where: {
            nc_id: query.nc_id,
            item: query.item,
        },
        defaults: {
            period: query.period,
            enable: query.enable,
        },
    }).then(async([item, isNew]) => {
        if(!isNew) {
            item.item = query.item;
            item.period = query.period;
            item.enable = query.enable;
            item.status = query.status;
            await item.save();
        }

        await formMaintainData().then(ret => res.status(200).send(ret));
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });

}

export async function createMaintainRecord() {
    
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

async function formMaintainData(request='all') {
    let findCond = {
        includes: [{model: Maintain_Item}, {model: Maintain_Record}]
    };

    if(request !== 'all') {
        findCond['where'] = { nc_id: request };
        console.log(findCond);
    }

    try{
        let retData = { status: [], records: [], };
        const rawData = await Nc_Info.findAll(findCond);
        if(rawData && rawData.length>0) {
            rawData.map(row => {
                if(row.Maintain_Item)
                    row.Maintain_Item.forEach(element => { retData.status.push(element) });
                if(row.Maintain_Record)
                    row.Maintain_Record.forEach(element => { retData.records.push(element) });
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