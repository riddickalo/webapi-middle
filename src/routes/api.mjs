import express from "express";
import { getVersion, getSettingParams, setSettingParams } from "../controllers/sysInfo.mjs";
import { getStatus } from "../controllers/nc_status.mjs";

const router = express.Router();

router.all('/', getVersion);
router.get('/status', getStatus);
router.get('/alarm', () => console.log('alarm api'));
router.get('/setting', () => console.log('setting api'));
router.get('/sys', getSettingParams);
router.post('/sys', setSettingParams);

export default router;