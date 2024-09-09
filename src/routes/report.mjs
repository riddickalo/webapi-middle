import { Router } from "express";
import { getReport } from "../controllers/report.mjs";

const router = Router();

router.get('/', getReport);

export default router;