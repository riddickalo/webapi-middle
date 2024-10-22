import swaggerJSDoc from "swagger-jsdoc";
import pckInfo from '../../package.json' assert { type: 'json' };
import { __dirname } from "./index.mjs";

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'webapi middle server',
        version: pckInfo.version,
        summary: 'middle server api docs',
        description: 'back-end api docs follows the OpenAPI',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
        }
    ],
};

const options = {
    swaggerDefinition,
    apis: [`${__dirname}/src/routes/*.mjs`],
};

export const swaggerSpec = swaggerJSDoc(options);