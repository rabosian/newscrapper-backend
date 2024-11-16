import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import indexRouter from './src/routes/index.js';
import cron from 'node-cron';
import { newsScheduler } from './src/scheduler/newsScheduler.js';
import { cleanUpScheduler } from './src/scheduler/cleanUpScheduler.js';

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', indexRouter);

// 환경변수 설정
dotenv.config();

// MongoDB 연결
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 서버에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'BE:Internal server error occurred',
  });
});

// 서버 시작
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 스케줄러
cron.schedule('0 */5 * * *', () => {
  // every minute: '* * * * *'
  // every 5 hours: '0 */5 * * *'
  console.log('Every five hours');
  newsScheduler();
});

// clean up 스케줄러
cron.schedule('0 */4 * * *', () => {
  // every minute: '* * * * *'
  console.log('Every four hours');
  cleanUpScheduler();
});
