import express from 'express';
import { getViews } from '../controllers/serveViews.mjs';

const router = express.Router();
router.get('*', getViews);
export default router;