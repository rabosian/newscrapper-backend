import express from 'express';
import { commentAI } from '../services/commentService.js';
import { authenticate } from '../controllers/authController.js';
const router = express.Router();

router.post('/', authenticate, commentAI); //로그인한 유저만 AI 기능 사용 가능하게 거르기
export default router;
