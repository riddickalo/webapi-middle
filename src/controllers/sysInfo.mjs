import pckInfo from '../../package.json' assert { type: 'json' };
import Setting from '../models/setting.mjs';
import { settingUpdateHook } from '../utils/hooks.mjs';

export async function getVersion(req, res) {
    console.info(pckInfo.version);
    res.send(pckInfo.version);
};

export async function getSettingParams(req, res) {
    await Setting.findOne({ where: { index: true } })
        .then(([setting, ]) => res.status(200).send(setting))
        .catch(err => res.status(404).send(err));
}

export async function setSettingParams(req, res) {
    const request = req.body;
    await Setting.findOne({ where: { index: true } })
        .then(async (ret) => {
            const attrList = Object.keys(ret.dataValues);
            for(let i of attrList) {
                ret[i] = request[i];
            }
            await ret.save().then(newSetting => {
                settingUpdateHook(newSetting);
                res.status(200).send(newSetting);
            });
        }).catch(err => res.status(404).send(err));
}