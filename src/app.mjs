import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import logger from './utils/logger.mjs';
import http from 'http';
import https from 'https';
import { config, __dirname } from './config/index.mjs';
import api_routes from './routes/api.mjs';
import view_routes from './routes/view.mjs';
import report_routes from './routes/report.mjs'
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import './bin/www.mjs';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './config/swagger.mjs';

const env = process.env.NODE_ENV || 'development';
export const middle_app = express();

// some middleware utilizations
middle_app.use(helmet());
middle_app.use(compression());

middle_app.use(express.json());
middle_app.use(express.urlencoded({ extended: true }));
middle_app.use(cors(config.corsOption));

// routing
middle_app.get('/', (_, res) => res.redirect('/views'));        // redirect from '/' to '/views'
middle_app.use(express.static(path.join(__dirname, 'src/views')));
middle_app.use('/views', view_routes);

middle_app.use('/api', api_routes);
middle_app.use('/report', report_routes);

// swagger ui setting
middle_app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = config.port;

if(env === 'production') {
        const httpsOptions = {
                key: fs.readFileSync(path.join(__dirname, 'ssl/key.pem')),
                cert: fs.readFileSync(path.join(__dirname, 'ssl/cert.pem')),
            };
        https.createServer(httpsOptions, middle_app).listen(PORT, 
                () => logger.verbose(`webapi-middle app is running on ${PORT} through HTTPS`));
} else {
        http.createServer(middle_app).listen(PORT, 
                () => logger.verbose(`webapi-middle app is running on ${PORT}`));
}
