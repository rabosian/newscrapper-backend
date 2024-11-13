import express from 'express';
const router = express.Router();
import { newsAPI_Everything } from '../services/newsApiService.js';

router.get('/', newsAPI_Everything);

export default router;
