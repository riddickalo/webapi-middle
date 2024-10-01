export function convertTimeFormat(time, type='hour') {
    let timeStr = `${time.getFullYear()}/${time.getMonth()+1}`;
    if(type === 'day')
        timeStr += `/${time.getDate()}`;
    else if(type === 'hour')
        timeStr += `/${time.getDate()}`;
        timeStr += ` ${time.getHours()}:${time.getMinutes()}`;
    return timeStr;
}

export function convertMinutesStr(secTime) {
    const mins = Math.floor(secTime / 60);
    const secs = secTime % 60;
    return `${mins}'${secs}"`;
}