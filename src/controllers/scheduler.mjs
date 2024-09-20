import * as scheduler from 'node-schedule';
import { sys_config, maintain_config } from '../config/index.mjs';
import { getDeviceEvents, updateUtilize, formDailyLineReport, checkMaintainItems } from './scheduledJobs.mjs';

console.info('Scheduler mounted');

// FOCAS 更新資料頻率
// mount scheduler only under active sync mode
const sync_mode = process.env.FOCAS_SYNC_MODE || 'active';
if(sync_mode === 'active') {
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

// 輪詢保養項目 檢查時效
export const MaintainItem_pollingRule = new scheduler.RecurrenceRule();
const pollingTime = maintain_config.polling_maintain_time.split(':');
MaintainItem_pollingRule.hour = [Number(pollingTime[0])];
MaintainItem_pollingRule.minute = [Number(pollingTime[1])];
MaintainItem_pollingRule.second = [7];

export const MaintainItem_pollingJob = scheduler.scheduleJob(MaintainItem_pollingRule, 
    () => checkMaintainItems());

