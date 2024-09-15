import { Router } from "express";
import { getReport } from "../controllers/reports.mjs";

const router = Router();

router.get('/', getReport);

export default router;