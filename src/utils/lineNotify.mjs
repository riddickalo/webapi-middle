import { sys_config } from "../config/index.mjs";

export async function sendLineDaily(contents, timestamp) {
    try{
        let msg = '\n';

        let total_amount = 0;
        msg += '<戰情中控台 Line日產量通知>\n';
        msg += `${timestamp.getMonth()+1}/${timestamp.getDate()} 產量簡報\n`;

        for(let item of contents) {
            msg += `機台: ${item.nc_id}, 即時稼動率: ${item.utilize_rate}%, 今日產量: ${item.prod_count}\n`;
            total_amount += item.prod_count;
        }
        msg += `日產量總計: ${total_amount}`;

        toLineNotify(msg, sys_config.line_daily_token);
    } catch(err) {
        console.error(err);
    }
}

export async function sendLineAlarm(content) {
    try{
        let msg = '\n';
        const time = new Date(content.alarm_timestamp);
        if(sys_config.line_alarm_ln === 'en') {    // english message

        } else {                            // zh-TW message
            msg += '<戰情中控台 Line即時警報通知>\n';
            msg += `機台名稱： ${content.nc_id} \n`;
            msg += `於 ${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} `;
            msg += `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} \n`;
            msg += `因 ${content.alarm_msg} \n發生警報，請盡快派工處理！`;
        }
        console.log(msg)
        toLineNotify(msg, sys_config.line_alarm_token);
    } catch(err) {
        console.error(err);
    }
}

function toLineNotify(msg, token) {
    const lineNotifyUrl = 'https://notify-api.line.me/api/notify';
    
    // using Bearer auth
    const header = {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
    }        
    fetch(lineNotifyUrl, { method: "POST", headers: header, body: `message=${msg}` })
        .then(resp => console.log(resp)).catch(err => console.error(err));
}
