import express from 'express';
import { getVersion } from '../controllers/general.mjs';

const router = express.Router();
router.all('/', getVersion);

export default router;