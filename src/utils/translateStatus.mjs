// 轉換運行狀態
export function getOpStatus(rawData) {
    if(rawData.connected === 0){
        return 'offline';
    } else {
        if(rawData.alarm === 1){
            return 'alarm';
        } else {
            if(rawData.emergency === 1){
                return 'warning';
            } else {
                if(rawData.running === 2) return 'pause';
                else if(rawData.running === 3) return 'running';
                else return 'idle';
            }
        }
    }
}

// 轉換廠區
export function setRegion(rawData) {

}


// const opStatus = [
//     { code: 0, key: 'all', value: '全部' },
//     { code: 1, key: 'warning', value: '警告' },
//     { code: 2, key: 'alarm', value: '警報' },
//     { code: 3, key: 'running', value: '運轉中' },
//     { code: 4, key: 'idle', value: '閒置中' },
//     { code: 5, key: 'offline', value: '未連線' },
//     { code: 6, key: 'pause', value: '暫停中' },
//     { code: 7, key: 'teach', value: '示教中' },
//     { code: 8, key: 'unknown', value: '未知' },
// ];