import pckInfo from '../../package.json' assert { type: 'json' };
import path from 'path';

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
    console.log(path.join(process.cwd(), 'src/views/index.html'));
    res.sendFile(path.join(process.cwd(), 'src/views/index.html'));
}