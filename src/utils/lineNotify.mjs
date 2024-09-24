import { sys_config } from "../config/index.mjs";

export async function sendLineDaily(contents, timestamp) {
    try{
        let msg = '\n';

        let total_amount = 0;
        msg += '<Line日產量通知>\n';
        msg += `${timestamp.getMonth()+1}/${timestamp.getDate()} 產量簡報\n`;

        for(let item of contents) {
            msg += `機台: ${item.nc_id} 即時稼動率: ${item.utilize_rate}pct. 今日產量: ${item.prod_count}\n`;
            total_amount += item.prod_count;
        }
        msg += `日產量總計: ${total_amount}`;
        
        await toLineNotify(msg, sys_config.line_daily_token);
    } catch(err) {
        console.error(err);
    }
}

export async function sendLineAlarm(content) {
    try{
        let msg = '\n';
        const time = new Date(content.alarm_timestamp);
        if(sys_config.line_alarm_ln === 'en') {    // english message
            msg += '<Line Alarm Notify>\n';
            msg += `Machine ID： ${content.nc_id} \n`;
            msg += `Alarm emerged at ${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} `;
            msg += `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} \n`;
            if(content.alarm_msg !== null) msg += `possibly caused by ${content.alarm_msg} \n`;
            msg += `please handle it immediately！`;

        } else {                            // zh-TW message
            msg += '<Line即時警報通知>\n';
            msg += `機台名稱： ${content.nc_id} \n`;
            msg += `於 ${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} `;
            msg += `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} \n`;
            if(content.alarm_msg !== null) msg += `因 ${content.alarm_msg} \n`;
            msg += `發生警報，請盡快派工處理！`;
        }
        // console.log(msg)
        await toLineNotify(msg, sys_config.line_alarm_token);
    } catch(err) {
        console.error(err);
    }
}

export async function testLineFunction() {
    try{
        let testAlarmMsg = '';
        let testDailyMsg = '';
        if(sys_config.line_alarm_ln === 'en') {

        } else {
            testAlarmMsg += '\n<Line Alarm Notify test message>';
            testDailyMsg += '\n<Line Daily Report test message> ';
        }
        await toLineNotify(testAlarmMsg, sys_config.line_alarm_token);   // test alarm notify
        await toLineNotify(testDailyMsg, sys_config.line_daily_token);   // test daily notify
        return Promise.resolve();

    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }
}

async function toLineNotify(msg, token) {
    const lineNotifyUrl = 'https://notify-api.line.me/api/notify';
    
    // using Bearer auth
    const header = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
    }        

    const resp = await fetch(lineNotifyUrl, { method: "POST", headers: header, body: `message=${msg}` });
    if(resp.status < 300) return Promise.resolve(resp.status);
    else return Promise.reject([resp.status, msg]);
}
