import { Sequelize } from "sequelize";
import { orm_config } from "../config/index.mjs";

const orm_agent = new Sequelize(orm_config);
export default orm_agent;