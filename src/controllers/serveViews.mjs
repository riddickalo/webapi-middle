import path from 'path';
import { __dirname } from '../config/index.mjs';
import logger from '../utils/logger.mjs';

// serve static index.html
export function getViews(req, res) {
    logger.silly(req.params);
    res.sendFile(path.join(__dirname, 'src/views/index.html'));
}