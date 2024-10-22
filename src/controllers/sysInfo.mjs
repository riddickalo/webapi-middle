import pckInfo from '../../package.json' assert { type: 'json' };
import Setting from '../models/setting.mjs';
import { settingUpdateHook } from '../utils/hooks.mjs';
import logger from '../utils/logger.mjs';

export async function getVersion(req, res) {
    logger.http('version request: ', pckInfo.version);
    res.send(pckInfo.version);
};

export async function getSettingParams(req, res) {
    await Setting.findOne({ where: { index: true } })
        .then(setting => {
            logger.debug('get setting: ', setting);
            res.status(200).send(setting);
        }).catch(err => {
            logger.info('in getSettingParams()', err);
            res.status(404).send(err);
        });
}

export async function setSettingParams(req, res) {
    const request = req.body;
    logger.http('set setting: ', request);
    await Setting.findOne({ where: { index: true } })
        .then(async (ret) => {
            const attrList = Object.keys(ret.dataValues);
            for(let i of attrList) {
                ret[i] = request[i];
            }
            await ret.save().then(newSetting => {
                settingUpdateHook(newSetting);
                logger.debug('new setting: ', newSetting);
                res.status(200).send(newSetting);
            });
        }).catch(err => {
            logger.info('in setSettingParams()', err);
            res.status(404).send(err);
        });
}