import { json2csv } from "json-2-csv";
import { json2csv_config } from "../config/index.mjs";
import { Op } from "sequelize";
import Setting from "../models/setting.mjs";
import Nc_Info from "../models/nc_info.mjs";
import Prod_Record from "../models/prod_record.mjs";
import { formNcReport, formItemReport } from "../utils/formReports.mjs";

export async function getReport(req, res) {
    const query = req.query;
    const report_type = query.type.split('_');
    try{
        let rawData;
        let retData = [];

        if(report_type[0] === 'nc') {
            rawData = await Prod_Record.findAll({ 
                where: {
                    valid_flag: 1,
                    endTime: {
                        [Op.lt]: `${query.endTime.slice(0, 4)}-${query.endTime.slice(4, 6)}-${query.endTime.slice(6, 8)} \
                        ${query.endTime.slice(9, 11)}:${query.endTime.slice(11, 13)}:00`,
                        [Op.gte]: `${query.startTime.slice(0, 4)}-${query.startTime.slice(4, 6)}-${query.startTime.slice(6, 8)} \
                        ${query.startTime.slice(9, 11)}:${query.startTime.slice(11, 13)}:00`,
                    },
                },
                order: [['nc_id', 'ASC'], ['endTime', 'ASC']],            
            });
            
            retData = formNcReport(rawData, report_type[1]);
            
        } else if((report_type[0] === 'item')) {
            rawData = await Prod_Record.findAll({ 
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

            // rawData.map(row => retData.push(row.dataValues));
            retData = formItemReport(rawData, report_type[1]);
        }
        
        const report = json2csv(retData);
        const filename = `${req.query.endTime}.csv`;

        // response
        res.header('Content-Type: text/csv; charset=utf-8;');
        res.attachment(filename);
        res.status(200).send(report);

    } catch(err) {
        console.error(err);
        res.status(404).send(err);
    }
}