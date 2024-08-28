import express from 'express';
import { config } from './src/config/index.mjs';
import api_routes from './src/routes/machine.mjs';

export const middle_app = express();

middle_app.use(express.json());
middle_app.use(express.urlencoded({ extended: true }));

middle_app.use('/machine', api_routes);

const PORT = config.port;
middle_app.listen(PORT, () => {
    console.info(`webapi-middle app is running on ${PORT}`);
});