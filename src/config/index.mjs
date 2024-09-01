import path from 'path';

export const __dirname = path.resolve();

export const config = {
    port: process.env.PORT || 5000,
    corsOption: {
        origin: '*',
        methods: 'GET, POST',
        preflightContinue: false,
        allowedHeaders: '*'
    },
}

export const orm_config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
}