export function convertTimeFormat(time, type='hour') {
    let timeStr = `${time.getFullYear()}/${time.getMonth()+1}`;
    if(type === 'day')
        timeStr += `/${time.getDate()}`;
    else if(type === 'hour')
        timeStr += ` ${time.getHours()}:${time.getMinutes()}`;
    return timeStr;
}