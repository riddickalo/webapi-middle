import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";

export default class Nc_Info extends Model {}

Nc_Info.init(
    {
        nc_id: {            // 機台名稱
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        region: {   
            type: DataTypes.STRING,
            allowNull: true,
        },
        prod_line: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        station: {          // 工作站
            type: DataTypes.STRING,
            allowNull: true,
        },
        opStatus: {         // 運行狀態
            type: DataTypes.STRING,
            defaultValue: 'offline'
        },
        ncfile: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        maintainStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        utilize_rate: {     // 稼動率
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    },
    {
        sequelize: orm_agent,
        modelName: 'Nc_Infos',
        timestamps: true,
    }
)