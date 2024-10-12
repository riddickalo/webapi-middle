import express from 'express';
import { getViews } from '../controllers/serveViews.mjs';

const router = express.Router();
router.get('*', getViews);
export default router;

/**
 *@swagger
 *   /views:
 *       get:
 *           summary: get webapi views
 *           responses:
 *               200: 
 *                   description: retrieve and render pages
*/ 