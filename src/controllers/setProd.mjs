import Prod_Record from "../models/prod_record.mjs";

/* 
根據狀態變化 修改Prod_Records的生產紀錄
prevData: Prod_Record
currData: FOCAS return format
*/
export async function insertProd(prevData, currData, currStatus, test=false) {
    if(test) {
        retData = await Prod_Record.create({
            nc_id: prevData.nc_id,
            ncfile: prevData.ncfile,
            region: prevData.region,
            station: prevData.station,
            prod_line: prevData.prod_line,
            startTime: prevData.timestamp,
        });
        console.log('new product record')
    } else{
        try{
            let retData = null;
            if(prevData.running_flag === 3) {
                await Prod_Record.findAll({
                    where: { nc_id: prevData.nc_id, },
                    order:[['startTime', 'DESC']],
                    limit: 1,
                }).then(async (records) => {
                    console.log(records)
                    for(let res of records) {
                        if(currStatus === 'idle') {
                            res.prod_status = 1;
                        } else {
                            res.prod_status = 0;
                        }
                        const resStart = new Date(res.startTime);
                        const resEnd = new Date(currData.timestamp);
                        res.endTime = currData.timestamp;
                        res.duration = (resEnd.getTime() - resStart.getTime()) / 1000;
                        retData = await res.save();
                    }
                });
                console.log('resolve product record')

            } else if(prevData.running_flag === 0 && currData.running === 3) {
                retData = await Prod_Record.create({
                    nc_id: currData.deviceName,
                    ncfile: currData.exeProgName,
                    region: currData.region,
                    station: currData.station,
                    prod_line: currData.prod_line,
                    startTime: currData.timestamp,
                });
                console.log('new product record')
            }

            return Promise.resolve(retData);
        } catch(err) {
            return Promise.reject(err);
        }
    }

}