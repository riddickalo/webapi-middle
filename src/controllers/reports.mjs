import { json2csv } from "json-2-csv";
import { jsonAsXlsx_config } from "../config/index.mjs";
import xlsx from "json-as-xlsx";
import { Op } from "sequelize";
import Nc_Info from "../models/nc_info.mjs";
import Prod_Record from "../models/prod_record.mjs";
import { convertTimeFormat } from "../utils/timeFormat.mjs";

// resolve report requests
export async function getReport(req, res) {
    const query = {
        type: req.query.type.split('_'),
        startTime: req.query.startTime.split('-'),
        endTime: req.query.endTime.split('-'),
    };

    try{
        if(query.type[0] === 'nc') {
            const [reports, _] = await formNcReport(query);
            // console.log(reports)

            // response
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream;',
                // 'Content-disposition': `attachment; filename=${filename}`,
            });
            res.end(xlsx(reports, jsonAsXlsx_config));

        } else if(query.type[0] === 'item') {
            let retData = await formItemReport(report_type[1]);
            const filename = `${req.query.type}_${req.query.endTime}.csv`;
            // response
            res.header('Content-Type: text/csv; charset=utf-8;');
            res.attachment(filename);
            res.status(200).send(json2csv(retData));

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
        const filename = `${query.type[0]}_${query.endTime}.xlsx`;
        // get all nc, traversal them
        const ncList = await Nc_Info.findAll({ order: [['nc_id', 'ASC']], attributes: ['nc_id', 'region', 'prod_line', 'station'] });
        for(let nc of ncList) {
            const rangeEnd = new Date([`${query.endTime[0]}-${query.endTime[1]}-${query.endTime[2]}`, `${query.endTime[3]}:${query.endTime[4]}:00`]);
            const rangeStart = new Date([`${query.startTime[0]}-${query.startTime[1]}-${query.startTime[2]}`, `${query.startTime[3]}:${query.startTime[4]}:00`]);
            let content = [];
            if(query.type[1] === 'month') {     // request for month report
                while(rangeStart < rangeEnd) {
                    const monthRunner = new Date(rangeStart);
                    monthRunner.setMonth(rangeStart.getMonth() + 1);
                    if(monthRunner > rangeEnd) {
                        monthRunner.setTime(rangeEnd.getTime());
                    } else {
                        monthRunner.setDate(1);
                        monthRunner.setHours(0);
                        monthRunner.setMinutes(0);
                    }
                    // count ncfile
                    let rawData = await Prod_Record.count({
                        where: {
                            nc_id: nc.nc_id,
                            valid_flag: 1,
                            endTime: {
                                [Op.lt]: monthRunner,
                                [Op.gte]: rangeStart,
                            }
                        },
                        col: 'ncfile',
                        attributes: ['ncfile'],
                        group: ['ncfile'],
                    });
                    rawData.forEach(row => {
                        content.push({
                            region: nc.region,
                            prod_line: nc.prod_line,
                            station: nc.station,
                            ncfile: row.ncfile,
                            time_tag: convertTimeFormat(rangeStart, query.type[1]),
                            count: (row.count)? row.count: 0,
                        })
                    });
                    rangeStart.setTime(monthRunner.getTime());
                }
                // set excel columns
                const monthColumns = [
                    { label: 'Factory Region', value: 'region' },
                    { label: 'Production Line', value: 'prod_line' },
                    { label: 'Work Station', value: 'station' },
                    { label: 'NC File', value: 'ncfile' },
                    { label: 'Timestamp', value: 'time_tag' },
                    { label: 'Count', value: 'count' },
                ];
                retData.push({ sheet: nc.nc_id, columns: monthColumns, content: content });

            } else if(query.type[1] === 'day') {    // request for day report
                while(rangeStart < rangeEnd) {
                    const dateRunner = new Date(rangeStart);
                    dateRunner.setDate(rangeStart.getDate() + 1);
                    // count(ncfile)
                    let rawData = await Prod_Record.count({
                        where: {
                            nc_id: nc.nc_id,
                            valid_flag: 1,
                            endTime: {
                                [Op.lt]: dateRunner,
                                [Op.gte]: rangeStart,
                            }
                        },
                        col: 'ncfile',
                        attributes: ['ncfile'],
                        group: ['ncfile'],
                    });
                    rawData.forEach(row => {
                        content.push({
                            region: nc.region,
                            prod_line: nc.prod_line,
                            station: nc.station,
                            ncfile: row.ncfile,
                            time_tag: convertTimeFormat(rangeStart, query.type[1]),
                            count: (row.count)? row.count: 0,
                        })
                    });
                    rangeStart.setTime(dateRunner.getTime());
                }
                // set excel columns
                const dayColumns = [
                    { label: 'Factory Region', value: 'region' },
                    { label: 'Production Line', value: 'prod_line' },
                    { label: 'Work Station', value: 'station' },
                    { label: 'NC File', value: 'ncfile' },
                    { label: 'Timestamp', value: 'time_tag' },
                    { label: 'Count', value: 'count' },
                ];
                retData.push({ sheet: nc.nc_id, columns: dayColumns, content: content });

            } else {        // request for detail report
                // get all product records
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
                    content.push({
                        region: nc.region,
                        prod_line: nc.prod_line,
                        station: nc.station,
                        ncfile: row.ncfile,
                        startTime: convertTimeFormat(row.startTime, query.type[1]),
                        endTime: convertTimeFormat(row.endTime, query.type[1]),
                        duration: row.duration,
                    });
                });
                // set excel columns
                const hourColumns = [
                    { label: 'Factory Region', value: 'region' },
                    { label: 'Production Line', value: 'prod_line' },
                    { label: 'Work Station', value: 'station' },
                    { label: 'NC File', value: 'ncfile' },
                    { label: 'Process Start Time', value: 'startTime' },
                    { label: 'Process End Time', value: 'endTime' },
                    { label: 'Process Duration (sec)', value: 'duration' },
                ];
                retData.push({ sheet: nc.nc_id, columns: hourColumns, content: content });
            }
        }
        // console.log(retData[0]);
        return Promise.resolve([retData, filename]);
    } catch(err) {
        console.error(err);
        return Promise.reject();
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

/* json to sheet template
const data: IJsonSheet[] = [
    {
      sheet: "Adults",
      columns: [
        { label: "Name", value: "name" },
        { label: "Age", value: "age", format: '# "years"' },
      ],
      content: [
        { name: "Monserrat", age: 21, more: { phone: "11111111" } },
        { name: "Luis", age: 22, more: { phone: "12345678" } },
      ],
    },
    {
      sheet: "Pets",
      columns: [
        { label: "Name", value: "name" },
        { label: "Age", value: "age" },
      ],
      content: [
        { name: "Malteada", age: 4, more: { phone: "99999999" } },
        { name: "Picadillo", age: 1, more: { phone: "87654321" } },
      ],
    },
  ]
*/