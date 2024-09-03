import * as scheduler from 'node-schedule';
import { getDeviceEvents, updateUtilize } from './scheduled_jobs.mjs';

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

if(process.env.DEV_ENV !== 'local'){
    const Focas_syncJob = scheduler.scheduleJob(Focas_syncRule, 
        () => getDeviceEvents());
}

// 更新稼動率
// FOCAS 更新資料頻率
const Utilize_updateRule = new scheduler.RecurrenceRule();
Utilize_updateRule.minute = (() => {
    let rule = [];
    const period = Number(process.env.UTILIZE_POLL_INTERVAL) || 1;
    for(let i=0; i<60; i+=period) {
        rule.push(i);
    } 
    return rule; 
})();

const Utilize_updateJob = scheduler.scheduleJob(Utilize_updateRule, 
    () => updateUtilize());

