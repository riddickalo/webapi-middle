import express from "express";

const router = express.Router();

router.all('/', console.log('alarm api'));

export default router;