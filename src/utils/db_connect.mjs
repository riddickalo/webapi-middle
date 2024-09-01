import { Sequelize } from "sequelize";

export async function syncORM(config) {
    const pg_agent = new Sequelize(config);
    return pg_agent.sync({ alter: true, force: false })
}