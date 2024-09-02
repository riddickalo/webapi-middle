import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";

export default class Setting extends Model {}

Setting.init(
    {
        index: {
            type: DataTypes.BOOLEAN,
            primaryKey: true,
            defaultValue: true,
        },
        current_user: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        polling_interval: {
            type: DataTypes.INTEGER,
            defaultValue: 60,
        },
        sys_ln: {               // 系統語系
            type: DataTypes.STRING,
            defaultValue: '繁體中文',
        },
        line_alarm_status: {    // Line 即時警報通知
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        line_alarm_token: {
            type: DataTypes.STRING,
            defaultValue: '37v9RzV9SWv7pHEYHEkzzYGwmoeDeLDdn3Hw1iOQaj3',
        },
        line_alarm_ln: {
            type: DataTypes.STRING,
            defaultValue: 'en',
        },
        line_alarm_timezone: {
            type: DataTypes.STRING,
            defaultValue: 'Taipei',
        },
        line_date_status: {     // Line 日產量通知
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        line_date_token: {
            type: DataTypes.STRING,
            defaultValue: '37v9RzV9SWv7pHEYHEkzzYGwmoeDeLDdn3Hw1iOQaj3',
        },
        line_date_time: {
            type: DataTypes.STRING,
            defaultValue: '10:00',
        },
        email_smtp: {           // Email 設定
            type: DataTypes.STRING,
            defaultValue: 'mail.jacktech.com.tw',
        },
        email_port: {
            type: DataTypes.STRING,
            defaultValue: '587',
        },
        email_account: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email_password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email_from: {
            type: DataTypes.STRING,
            defaultValue: 'auto@jacktech.com.tw',
        },
        email_alarm_status: {   // Email 即時警報通知
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        email_alarm_to: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email_alarm_cc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email_date_status: {    // Email 日產量通知
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        email_date_to: {
            type: DataTypes.STRING,
            defaultValue: 'jack@jacktech.com.tw',
        },
        email_date_cc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email_date_time: {
            type: DataTypes.STRING,
            defaultValue: '10:00',
        },
    },
    {
        sequelize: orm_agent,
        modelName: 'Setting',
        timestamps: true,
        createdAt: false,
    }
)