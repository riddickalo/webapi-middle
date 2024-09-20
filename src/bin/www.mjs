#!/usr/bin/env node
import orm_agent from "../models/orm_agent.mjs";
import Alarm from '../models/alarm.mjs';
import Nc_Info from "../models/nc_info.mjs";
import Prod_Record from '../models/prod_record.mjs';
import Setting from "../models/setting.mjs";
import Maintain_Item from "../models/maintain_item.mjs";
import Maintain_Record from "../models/maintain_record.mjs";
import '../models/associations.mjs';
import { sys_config } from "../config/index.mjs";
import { settingUpdateHook } from "../utils/hooks.mjs";

import '../controllers/scheduler.mjs';

(async() => {
    try{
        await orm_agent.sync({ alter: true }).then(() => console.info('ORM model sync'));
        await Setting.findOrCreate({ where: { index: true } })
                            .then(([ret,]) => {
                                settingUpdateHook(ret);
                                console.log('Settings initialized...');
                            });
        
    } catch(err) {
        console.error(err);
    }   
})();