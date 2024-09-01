import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";

export default class Prod_Record extends Model {}

Prod_Record.init(
    {
        sn: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        item_sn: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        item_name: {
            type: DataTypes.STRING,
        },
        item_type: {
            type: DataTypes.STRING,
            allowNull: true,
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
        prod_line: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize: orm_agent,
        modelName: 'Prod_Records',
        timestamps: true,
        updatedAt: false,
    },
)