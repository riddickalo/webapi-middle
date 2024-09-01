import { Sequelize, DataTypes, Model } from "sequelize";
import orm_agent from "./orm_agent.mjs";

export default class User extends Model {};

User.init(
    {
        userName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userAlias: {        // 暱稱
            type: DataTypes.STRING,
            allowNull: true,
        },
        userPassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accesses: {         // 權限
            type: DataTypes.ARRAY(DataTypes.BOOLEAN),
            defaultValue: [true, true, true, true, true, true, 
                            true, true, true, true, true, true, 
                            false, false, false, false, false],
        },
        userStatus: {       // 啟用狀態
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        sequelize: orm_agent,
        modelName: 'Users',
        timestamps: true,
    }
);