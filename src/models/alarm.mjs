import { Sequelize, DataTypes, Model, BelongsTo } from "sequelize";
import orm_agent from "./orm_agent.mjs";

export default class Alarm extends Model {}

Alarm.init(
    {
        alarm_sn: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        nc_id: {
            type: DataTypes.STRING,
        },
        alarm_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alarm_msg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        alarm_timestamp: {
            type: DataTypes.DATE,
        },
        history_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        sequelize: orm_agent,
        modelName: 'Alarms',
        timestamps: true,
        updatedAt: false,
    }
);
