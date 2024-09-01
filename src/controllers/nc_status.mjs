import Nc_Info from "../models/nc_info.mjs";

export async function getStatus(req, res) {
    // res.status(200).send(demoData);
    await Nc_Info.findAll({ order: [['nc_id', 'DESC']] })
        .then((ret_data) => {
            res.status(200).send(ret_data);
        }).catch(({original, }) => {
            res.status(404).send(original.error);
        });
}


function createData(region, prod_line, station, nc_id, opStatus, ncfile, maintainStatus, utilize_rate) {
    return { region, prod_line, station, nc_id, opStatus, ncfile, maintainStatus, utilize_rate };
}

const demoData = [
    createData('總部', 'RG', '內溝研磨', 'GI-700-3', 'alarm', 'O999', true, 25),
    createData('總部', 'RG', '平測磨', 'SG-500-1', 'idle', 'G100', false, 43),
    createData('一廠', 'MG', '內溝研磨', 'GI-700-4', 'running', 'O991', true, 88),
    createData('一廠', 'MG', '關節手臂', 'Fanuc M-800i', 'running', 'Main.tch', false, 91),
    createData('二廠', 'EG', '裝配', 'GI-700-6', 'idle', 'O999', false, 60),
];