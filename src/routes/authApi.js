import express from 'express';
import {
  loginWithEmail,
  loginWithGoogle,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginWithEmail);
router.post('/google', loginWithGoogle);

export default router;
