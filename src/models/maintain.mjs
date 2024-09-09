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
        item: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        period: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }

    },
    {
        sequelize: orm_agent,
        modelName: 'Maintain_Item',
    }
)