import Prod_Record from "../models/prod_record.mjs";

/* 
根據狀態變化 修改Prod_Records的生產紀錄
prevData: Nc_Info
currData: FOCAS return format
*/
export async function updateProd(currStatus, currData, prevData=null) {
    try{
        let retData = null;
        if(prevData && prevData.running_flag === 3) {
            // console.log('update a product record');
            await Prod_Record.findAll({
                where: { nc_id: prevData.nc_id, },
                order:[['startTime', 'DESC']],
                limit: 1,
            }).then(async ([record,]) => {
                if(currStatus === 'idle') {
                    record.valid_flag = 1;
                } else {
                    record.valid_flag = 0;
                }
                const recStart = new Date(record.startTime);
                const recEnd = new Date(currData.timestamp);
                record.endTime = currData.timestamp;
                record.duration = (recEnd.getTime() - recStart.getTime()) / 1000;
                retData = await record.save();
            });
        } else if(!prevData || (prevData.running_flag === 0 && currData.running === 3)) {
            // console.log('create a product record');
            retData = await Prod_Record.create({
                nc_id: currData.deviceName,
                ncfile: currData.exeProgName,
                region: currData.region,
                station: currData.station,
                prod_line: currData.prod_line,
                startTime: currData.timestamp,
            });
        }
            
        return Promise.resolve(retData);
    } catch(err) {
        return Promise.reject(err);
    }
}