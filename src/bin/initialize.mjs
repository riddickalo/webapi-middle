import orm_agent from "../models/orm_agent.mjs";
import Alarm from '../models/alarm.mjs';
import Nc_Info from "../models/nc_info.mjs";
import Prod_Record from '../models/prod_record.mjs';
import Setting from "../models/setting.mjs";
import '../models/associations.mjs';
import { settingUpdateHook } from "../utils/hooks.mjs";
import { getDeviceEvents, updateUtilize } from "../controllers/scheduledJobs.mjs";
import logger from "../utils/logger.mjs";

(async() => {
    // initialize db and sync all device events
    const mode = process.env.RUN_ENV || 'na';
    try{
        if(mode === 'initialize' || mode === 'test') {
            await orm_agent.sync({ force: true })
                            .then(() => logger.debug('ORM model initialized...'));

            await Setting.findOrCreate({ where: { index: true } })
                            .then(([ret,]) => {
                                settingUpdateHook(ret);
                                logger.debug('Settings initialized...');
                            });

            await getDeviceEvents().then(() => logger.debug('Device events initialized...'));

            if(mode === 'test')
                await updateUtilize().then(() => logger.debug('Utilize rate updated...'));
        } else {
            throw 'wrong env for initializing';
        }
        logger.debug('All works done~');
        process.exit();
        
    } catch(err) {
        throw err;
    }   
})();