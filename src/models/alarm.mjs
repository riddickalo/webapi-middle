import { Sequelize, DataTypes, Model } from "sequelize";
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
        region: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        station: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        alarm_timestamp: {
            type: DataTypes.DATE,
        }

    },
    {
        sequelize: orm_agent,
        modelName: 'Alarms',
        timestamps: true,
        updatedAt: false,
    }
)