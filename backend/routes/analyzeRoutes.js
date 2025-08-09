 import express from 'express';
import { analyze } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/analyze', analyze);

export default router;
