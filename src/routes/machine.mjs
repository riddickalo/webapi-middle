import express from "express";
import { greeting, greetingName } from "../controllers/general.mjs";
import { getStatus } from "../controllers/nc_status.mjs";
import { getDeviceEvents } from "../controllers/schduleJob.mjs";

const router = express.Router();

router.all('/', greeting);
router.all('/status', getStatus);
router.all('/get-device-events', getDeviceEvents);

export default router;