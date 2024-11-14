import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const API_KEY = process.env.NEWS_API_KEY;

export const newsAPI_Everything = async (req, res) => {
  try {
    let from = '2024-11-11'; // 일단 static으로 설정, scheduler 셋업 후 (오늘 날짜-2) 넣기
    let to = '2024-11-13';
    const URL = 'https://newsapi.org/v2/everything';

    // 도메인 블랙리스트: bbc.co.uk
    const response = await axios.get(URL, {
      params: {
        apiKey: API_KEY,
        domains: 'bloomberg.com,techcrunch.com',
        from,
        to,
        sortBy: 'publishedAt',
      },
    });
    res.json(response.data);
    // res.status(200).json({ status: 'Success', response });
  } catch (err) {
    res.status(500).json({ status: 'Failed', error: err.message });
  }
};
