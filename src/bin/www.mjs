#!/usr/bin/env node
import orm_agent from "../models/orm_agent.mjs";
import Alarm from '../models/alarm.mjs';
import Nc_Info from "../models/nc_info.mjs";
import Prod_Record from '../models/prod_record.mjs';
import Setting from "../models/setting.mjs";
import { sys_config } from "../config/index.mjs";
import { settingUpdateHook } from "../utils/hooks.mjs";

import '../controllers/scheduler.mjs';

(async() => {
    try{
        await orm_agent.sync({ alter: true }).then(() => console.info('ORM model sync'));
        
    } catch(err) {
        console.error(err);
    }   
})();