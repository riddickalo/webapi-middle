import express from "express";
import { getVersion, getSettingParams, setSettingParams } from "../controllers/sysInfo.mjs";
import { getStatus, setNcAttr, getAlarm } from "../controllers/getStatus.mjs";
import { deviceEventsHook } from "../controllers/eventHook.mjs";
import { getMaintainData, updateMaintainData, deleteMaintainItem } from "../controllers/maintain.mjs";
import { testNotify } from "../controllers/testNotify.mjs";

const router = express.Router();

router.all('/', getVersion);
router.get('/status', getStatus);               // 取得機台資料
router.post('/status', setNcAttr);              // 設定機台資料
router.get('/alarm/:type', getAlarm);           // 取得警報資料 
router.get('/sys', getSettingParams);           // 取得系統參數
router.post('/sys', setSettingParams);          // 設定系統參數
router.get('/maintain/:ncId', getMaintainData); // 取得保養項目資料
router.post('/maintain/:behavior', updateMaintainData);     // 更新保養項目
router.delete('/maintain/:itemSN', deleteMaintainItem);     // 刪除保養項目
router.all('/test-notify/:type', testNotify);   // 測試通知功能

router.post('/events-hook', deviceEventsHook);  // FOCAS更新資料 web-hook

export default router;