import { json2csv } from "json-2-csv";
import { json2csv_config } from "../config/index.mjs";
import { Op } from "sequelize";
import Setting from "../models/setting.mjs";
import Nc_Info from "../models/nc_info.mjs";
import Prod_Record from "../models/prod_record.mjs";
import * as dayjs from 'dayjs';
import { zipReports } from "../utils/zipFiles.mjs";

const convertTimeFormat = (time) => (
    dayjs(time).hour(dayjs(time).hour() + 8).format('YYYY/MM/DD HH:mm:ss')
)

// resolve report requests
export async function getReport(req, res) {
    const query = {
        type: req.query.type.split('_'),
        startTime: req.query.startTime.split('-'),
        endTime: req.query.endTime.spllit('-'),
    };

    try{
        let rawData;
        let retData = [];
        if(query.type[0] === 'nc') {
            const reports = formNcReport(query);
            const filename = `${req.query.type}_${req.query.endTime}.zip`;

            // response
            res.header('Content-Type: application/zip;');
            res.attachment(filename);
            res.status(200).send(zipReports(reports, query.type[1]));

        } else if(query.type[0] === 'item') {
            retData = formItemReport(report_type[1]);
            const report = json2csv(retData);
            const filename = `${req.query.type}_${req.query.endTime}.csv`;

            // response
            res.header('Content-Type: text/csv; charset=utf-8;');
            res.attachment(filename);
            res.status(200).send(report);

        }
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
}

// 組合機台報表
async function formNcReport(query) {
    try {
        let retData = [];
        let subRecords = [];
        let rangeEnd = new Date([`${query.endTime[0]}-${query.endTime[1] - 1}-${query.endTime[2]}`, `${query.endTime[3]}:${query.endTime[4]}:00`]);
        let rangeStart = new Date([`${query.startTime[0]}-${query.startTime[1] - 1}-${query.startTime[2]}`, `${query.startTime[3]}:${query.startTime[4]}:00`]);
        const ncList = await Nc_Info.findAll({ order: [['nc_id', 'ASC']], attributes: ['nc_id'] });
        for(let nc of ncList) {
            if(query.type === 'month') {
                while(rangeStart < rangeEnd) {
                    let rawData = await Prod_Record.count({
                        where: {
                            nc_id: row.nc_id,
                            valid_flag: 1,
                            endTime: {
                                [Op.gte]: rangeStart,
                                [Op.lt]: rangeStart.setMonth(rangeStart.getMonth() + 1),
                            }
                        },
                        col: 'ncfile',
                        attributes: ['ncfile'],
                        group: ['ncfile'],
                    });
                    rawData.forEach(row => {
                        subRecords.push({
                            region: nc.region,
                            prod_line: nc.prod_line,
                            station: nc.station,
                            ncfile: row.ncfile,
                            time_tag: convertTimeFormat(rangeStart),
                            count: (row.count)? row.count: 0,
                        })
                    });
                }
                retData.push({ nc_id: nc.nc_id, data: subRecords, file: json2csv(subRecords) });

            } else if(query.type === 'day') {
                while(rangeStart < rangeEnd) {
                    let rawData = await Prod_Record.count({
                        where: {
                            nc_id: row.nc_id,
                            valid_flag: 1,
                            endTime: {
                                [Op.gte]: rangeStart,
                                [Op.lt]: rangeStart.setDate(rangeStart.getDate() + 1),
                            }
                        },
                        col: 'ncfile',
                        attributes: ['ncfile'],
                        group: ['ncfile'],
                    });
                    rawData.forEach(row => {
                        subRecords.push({
                            region: nc.region,
                            prod_line: nc.prod_line,
                            station: nc.station,
                            ncfile: row.ncfile,
                            time_tag: convertTimeFormat(rangeStart),
                            count: (row.count)? row.count: 0,
                        })
                    });
                }
                retData.push({ nc_id: nc.nc_id, data: subRecords, file: json2csv(subRecords) });

            } else {
                let rawData = await Prod_Record.findAll({ 
                    where: {
                        nc_id: nc.nc_id,
                        valid_flag: 1,
                        endTime: {
                            [Op.lt]: rangeEnd,
                            [Op.gte]: rangeStart,
                        },
                    },
                    order: [['ncfile', 'ASC'], ['endTime', 'ASC']],            
                });
                
                rawData.forEach(row => {
                    subRecords.push({
                        region: nc.region,
                        prod_line: nc.prod_line,
                        station: nc.station,
                        ncfile: row.ncfile,
                        startTime: convertTimeFormat(row.startTime),
                        endTime: convertTimeFormat(row.endTime),
                    });
                });
                retData.push({ nc_id: nc.nc_id, data: subRecords, file: json2csv(subRecords) });
            }

            console.log(subRecords);
        }
        console.log(retData);
        return retData;
    } catch(err) {
        console.error(err);
    }
}

// 組合加工項目報表
async function formItemReport(query) {
    try{
        
        const rawData = await Prod_Record.findAll({ 
            where: {
                valid_flag: 1,
                endTime: {
                    [Op.lt]: `${query.endTime.slice(0, 4)}-${query.endTime.slice(4, 6)}-${query.endTime.slice(6, 8)} \
                    ${query.endTime.slice(9, 11)}:${query.endTime.slice(11, 13)}:00`,
                    [Op.gte]: `${query.startTime.slice(0, 4)}-${query.startTime.slice(4, 6)}-${query.startTime.slice(6, 8)} \
                    ${query.startTime.slice(9, 11)}:${query.startTime.slice(11, 13)}:00`,
                },
            },
            order: [['item_sn', 'ASC'], ['endTime', 'ASC']], 
        });

        let retData = [];
        rawData.map(row => retData.push(row.dataValues));
        return retData;
    } catch(err) {
        console.error(err);
    }
}