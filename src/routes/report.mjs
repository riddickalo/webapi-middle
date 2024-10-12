import { Router } from "express";
import { getReport } from "../controllers/reports.mjs";

const router = Router();
router.get('/', getReport);

export default router;

/**
 * @swagger
 *   /report:
 *       get:
 *           summary: request for production reports
 *           parameters:
 *               - name: type
 *                 in: query
 *                 required: true
 *                 type: string 
 *                 description: report types. it could be 'nc-month', 'nc-hour' 
 *               - name: startTime
 *                 in: query
 *                 required: true
 *                 type: string
 *                 description: report range. format='YYYY-MM-DD-HH-mm-ss'
 *               - name: endTime
 *                 in: query
 *                 required: true
 *                 type: string
 *           responses:
 *               200:
 *                   description: return .xlsx file and download
 *                   
 *               500:
 *                   description: compose report failed
*/ 