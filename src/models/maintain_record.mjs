import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";
import Maintain_Item from "./maintain_item.mjs";
import Nc_Info from "./nc_info.mjs";

export default class Maintain_Record extends Model {};

Maintain_Record.init(
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
        nc_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        worker: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        scheduled_check_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        actual_check_time: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        sequelize: orm_agent,
        modelName: 'Maintain_Records',
        timestamps: true,
    }
)

Maintain_Record.belongsTo(Nc_Info, {
    foreignKey: 'nc_id',
    onDelete: 'CASCADE',
})