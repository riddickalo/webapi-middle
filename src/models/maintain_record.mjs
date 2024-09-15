import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";
import Maintain_Item from "./maintain_item.mjs";
import Nc_Info from "./nc_info.mjs";

export default class Maintain_Record extends Model {};

Maintain_Record.init(
    {
        item_sn: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        nc_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        last_check: {
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

Maintain_Record.belongsTo(Maintain_Item, {
    foreignKey: 'item_sn',
    targetKey: 'sn',
    onDelete: 'CASCADE',
})

Maintain_Record.belongsTo(Nc_Info, {
    foreignKey: 'nc_id',
    onDelete: 'CASCADE',
})