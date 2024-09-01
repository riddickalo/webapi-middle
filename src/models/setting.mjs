import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";

export default class Setting extends Model {}

Setting.init(
    {
        
    },
    {
        sequelize: orm_agent,
        modelName: 'Settings',
        timestamps: true,
    }
)