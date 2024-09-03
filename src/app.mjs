import express from 'express';
import { createServer } from 'http';
import { config } from './config/index.mjs';
import api_routes from './routes/api.mjs';
import view_routes from './routes/view.mjs';
import cors from 'cors';
// import './bin/www.mjs';
import './models/model_init.mjs';
import './controllers/scheduler.mjs';

export const middle_app = express();

middle_app.use(express.json());
middle_app.use(express.urlencoded({ extended: true }));
middle_app.use(cors(config.corsOption));

middle_app.use('/api', api_routes);
middle_app.use('/views', view_routes);

const PORT = config.port;

createServer(middle_app).listen(PORT, 
        () => console.info(`webapi-middle app is running on ${PORT}`));


