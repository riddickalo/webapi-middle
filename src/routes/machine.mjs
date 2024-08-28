import express from "express";
import { greeting, greetingName } from "../controllers/general.mjs";

const router = express.Router();
router.all('/', greeting);

router.all('/:name', greetingName);

export default router;