import * as scheduler from 'node-schedule';
import { sys_config } from '../config/index.mjs';
import { getDeviceEvents, updateUtilize, formDailyLineReport } from './scheduledJobs.mjs';

console.info('Scheduler mounted');

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

if(process.env.RUN_ENV !== 'local'){
    const Focas_syncJob = scheduler.scheduleJob(Focas_syncRule, 
        () => getDeviceEvents());
}

// 更新稼動率
const Utilize_updateRule = new scheduler.RecurrenceRule();
Utilize_updateRule.second = 3;
Utilize_updateRule.minute = (() => {
    let rule = [];
    const period = Number(process.env.UTILIZE_POLL_INTERVAL) || 1;
    for(let i=0; i<60; i+=period) {
        rule.push(i);
    } 
    return rule; 
})();

if(process.env.RUN_ENV !== 'local'){
    const Utilize_updateJob = scheduler.scheduleJob(Utilize_updateRule, 
        () => updateUtilize());
}

// 日產量通知
export const LineDaily_notifyRule = new scheduler.RecurrenceRule();
LineDaily_notifyRule.hour = [Number(sys_config.line_daily_time.slice(0,2)),];
LineDaily_notifyRule.minute = [Number(sys_config.line_daily_time.slice(3,5)),];

export const LineDaily_notifyJob = scheduler.scheduleJob(LineDaily_notifyRule, 
    () => formDailyLineReport());

// export const EmailDaily_notifyRule = new scheduler.RecurrenceRule();
// EmailDaily_notifyRule.hour = [Number(sys_config.line_daily_time.slice(0,2)),];
// EmailDaily_notifyRule.minute = [Number(sys_config.line_daily_time.slice(3,5)),];

// export const EmailDaily_notifyJob = scheduler.scheduleJob(EmailDaily_notifyRule, 
//     () => sendDailyMsg());
