import pckInfo from '../../package.json' assert { type: 'json' };
import path from 'path';

const __dirname = path.resolve();

export async function greeting(req, res) {
    res.send('Hello world~');
};

export async function greetingName(req, res) {
    res.send(`Hello ${req.params.name}`);
};

export async function getVersion(req, res) {
    console.info(pckInfo.version);
    res.send(pckInfo.version);
};

export async function getViews(req, res) {
    console.log(path.join(__dirname, 'src/views/index.html'));
    res.sendFile(path.join(__dirname, 'src/views/index.html'));
}