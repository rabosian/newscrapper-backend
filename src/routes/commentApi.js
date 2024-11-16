import express from 'express';
const router = express.Router();
import { createComment, deleteComment, getCommentsByArticle } from '../controllers/commentController.js';
import { authenticate } from "../controllers/articleController.js"

router.post('/', authenticate, createComment);
router.get('/', getCommentsByArticle);
router.delete('/:id', deleteComment);

export default router;
