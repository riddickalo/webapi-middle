import path from 'path';

export const __dirname = path.resolve();

// server相關參數
export const config = {
    port: process.env.PORT || 5000,
    corsOption: {
        origin: '*',
        methods: '*',
        preflightContinue: false,
        allowedHeaders: '*'
    },
}

// ORM設定參數
export const orm_config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: (process.env.DB_VERBOSE==='false' || 
                process.env.DB_VERBOSE==='False' ||
                process.env.DB_VERBOSE==='f' ||
                process.env.DB_VERBOSE=== 0)? false: true,
}

// 系統設定參數
export let sys_config = {
    sys_ln: 'en',
    current_user: 'admin',
    line_alarm_status: false,
    line_alarm_token: '',
    line_alarm_ln: '',
    line_alarm_timezone: '',
    line_daily_status: false,
    line_daily_token: '',
    line_daily_time: '',
}

// 保養項目相關參數
export let maintain_config = {
    polling_maintain_time: '8:00',
}

// json2csv設定參數
export const json2csv_config = {
    
}