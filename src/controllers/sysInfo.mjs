import pckInfo from '../../package.json' assert { type: 'json' };
import path from 'path';
import Setting from '../models/setting.mjs';

const __dirname = path.resolve();

export async function getVersion(req, res) {
    console.info(pckInfo.version);
    res.send(pckInfo.version);
};

export async function getViews(req, res) {
    console.log(path.join(__dirname, 'src/views/index.html'));
    res.sendFile(path.join(__dirname, 'src/views/index.html'));
}

export async function getSettingParams(req, res) {
    await Setting.findOne({where: { index: true }})
        .then(setting => res.status(200).send(setting))
        .catch(err => res.status(404).send(err));
}

export async function setSettingParams(req, res) {
    const request = req.body;
    await Setting.findOrCreate({
        where: { index: true },
    }).then(async ([ret, ifNew]) => {
        const attrList = Object.keys(ret.dataValues);
        for(let i of attrList) {
            ret[i] = request[i];
        }
        await ret.save().then(newSetting => res.status(200).send(newSetting));
    }).catch(err => res.status(404).send(err));
}