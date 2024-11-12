import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new Error("Can't take token");
    }
    const token = tokenString.replace('Bearer ', '');
    jwt.verify(token, SECRET_KEY, (error, payload) => {
      if (error) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'Invalid token' });
      }
      req.userId = payload._id; // userId 필드를 새로 추가 후 payload._id 값을 할당
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'No account found with these details',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 'fail',
        message: 'Incorrect password. Please try again',
      });
    }

    const token = await user.generateAuthToken();
    return res.status(200).json({ status: 'success', user, token });
  } catch (error) {
    next(error);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        status: 'fail',
        message: 'No credential provided',
      });
    }

    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      user = new User({
        email,
        name,
        googleId,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId; // (login with email 유저이면)이미 이메일로 가입한 유저이면 googleId 연동
      await user.save();
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ status: 'success', user, token });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
