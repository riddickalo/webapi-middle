import path from 'path';
import { __dirname } from '../config/index.mjs';

// serve static index.html
export function getViews(req, res) {
    // console.log(req.params);
    res.sendFile(path.join(__dirname, 'src/views/index.html'));
}