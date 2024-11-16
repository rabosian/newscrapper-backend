import express from 'express';
const router = express.Router();
import { newsAPI_Everything } from '../services/newsApiService.js';
import articleController from '../controllers/articleController.js';

router.get('/', articleController.getArticles);

export default router;
