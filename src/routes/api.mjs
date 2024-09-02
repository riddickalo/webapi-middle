import express from "express";
import { greeting, greetingName } from "../controllers/general.mjs";
import { getStatus } from "../controllers/nc_status.mjs";

const router = express.Router();

router.all('/', greeting);
router.get('/status', getStatus);
router.get('/alarm', () => console.log('alarm api'));
router.get('/setting', () => console.log('setting api'))

export default router;