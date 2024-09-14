import { sys_config } from "../config/index.mjs";
import { LineDaily_notifyJob, LineDaily_notifyRule } from "../controllers/scheduler.mjs";
import { sendLineAlarm } from "./lineNotify.mjs";

// 對應前端更改的系統設定
export function settingUpdateHook(newSetting) {
    const attrList = Object.keys(sys_config);
    for(let item of attrList) {
        sys_config[item] = newSetting[item];
    }

    //  根據新設定 取消或重新排程日產量通知
    if(sys_config.line_daily_status) {
        LineDaily_notifyRule.hour = [Number(sys_config.line_daily_time.slice(0,2)),];
        LineDaily_notifyRule.minute = [Number(sys_config.line_daily_time.slice(3,5)),];
        LineDaily_notifyJob.reschedule(LineDaily_notifyRule);
    } else {
        LineDaily_notifyJob.cancel()
    }
}

export function alarmAssertHook(alarmData) {
    if(sys_config.line_alarm_status) sendLineAlarm(alarmData);
}