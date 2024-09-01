import * as scheduler from 'node-schedule';
import { getDeviceEvents } from '../utils/scheduled_jobs.mjs';

console.info('Scheduler mounted!')

// FOCAS 更新資料頻率
const Focas_syncRule = new scheduler.RecurrenceRule();
Focas_syncRule.second = (() => {
    let rule = [];
    const period = Number(process.env.FOCAS_SYNC_PERIOD) || 5;
    for(let i=0; i<60; i+=period) {
        rule.push(i);
    } 
    return rule; 
})();

const Focas_syncJob = scheduler.scheduleJob(Focas_syncRule, 
    () => getDeviceEvents());

