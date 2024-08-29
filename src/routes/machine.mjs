import express from "express";
import { greeting, greetingName } from "../controllers/general.mjs";
import { getStatus } from "../controllers/nc_status.mjs";

const router = express.Router();

router.all('/', greeting);
router.all('/status', getStatus);

export default router;