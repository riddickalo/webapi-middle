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
    const hrs = Math.floor(secTime/ 3600);
    let mins = Math.floor(secTime / 60);
    let secs = secTime % 60;
    
    if(hrs > 0) {
        mins = Math.floor((secTime % 3600) / 60);
        return `${hrs}h ${mins}m ${secs}s`;
    } else if(hrs <= 0 && mins > 0) {
        return `${mins}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}