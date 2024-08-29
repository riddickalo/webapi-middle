import express from 'express';
import { getViews } from '../controllers/general.mjs';

const router = express.Router();
router.all('/', getViews);
export default router;