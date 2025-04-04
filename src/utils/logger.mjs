import winston from "winston";
import "winston-daily-rotate-file";

const {format, transports} = winston;
const env = process.env.NODE_ENV || "development";
const loggerLevel = env === 'development' ? 'debug' : 'info';
const loggerTransports = [
    new transports.DailyRotateFile({
        dirname: 'logs',
        level: loggerLevel,
        filename: 'middle-app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
    })
];
if(env !== 'production') {
    loggerTransports.push(new transports.Console());
}


const logger = winston.createLogger({
    level: loggerLevel,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
    ),
    transports: loggerTransports,
    silent: false,
});

/*
    const levels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    };
*/

export default logger;