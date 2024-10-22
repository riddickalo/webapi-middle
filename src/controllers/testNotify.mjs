import { testLineFunction } from "../utils/lineNotify.mjs";
import logger from "../utils/logger.mjs";

export async function testNotify(req, res) {
    const reqType = req.params.type;
    logger.http('testNotify: ', reqType);

    if(reqType === 'Line') {
        await testLineFunction()
            .then(() => res.status(204).send()).catch(() => res.status(500).send());
    } else if(reqType === 'Email') {
        res.status(500).send('no test yet');
    } else {
        res.status(400).send();
    }
}