import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";

export default class Maintain_Item extends Model {};

Maintain_Item.init(
    {
        sn: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nc_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        item: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        period: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        enable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        scheduled_check_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        last_check_time: {
            type: DataTypes.DATE,
            allowNull: true,
        }

    },
    {
        sequelize: orm_agent,
        modelName: 'Maintain_Item',
        timestamps: true,
    }
)
