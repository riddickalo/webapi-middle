import express from "express";
import { getVersion, getSettingParams, setSettingParams } from "../controllers/sysInfo.mjs";
import { getStatus, setNcAttr } from "../controllers/nc_status.mjs";

const router = express.Router();

router.all('/', getVersion);
router.get('/status', getStatus);       // 取得機台資料
router.post('/status', setNcAttr);      // 設定機台資料
router.get('/alarm', () => console.log('alarm api'));       // 取得警報資料 
// router.get('/setting', () => console.log('setting api')); 
router.get('/sys', getSettingParams);   // 取得系統參數
router.post('/sys', setSettingParams);  // 設定系統參數

export default router;