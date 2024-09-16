import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";
import Nc_Info from "./nc_info.mjs";

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
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        last_check_time: {
            type: DataTypes.DATE,
            allowNull: true,
        }

    },
    {
        sequelize: orm_agent,
        modelName: 'Maintain_Item',
    }
)

Maintain_Item.belongsTo(Nc_Info, {
    foreignKey: 'nc_id',
    onDelete: 'CASCADE',
})