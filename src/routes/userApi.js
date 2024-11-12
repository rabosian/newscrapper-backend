import express from 'express';
import { createUser, getUser } from '../controllers/userController.js';
import { authenticate } from '../controllers/authController.js';

export const router = express.Router();

router.post('/', createUser);
router.get('/me', authenticate, getUser);

export default router;
