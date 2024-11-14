import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const API_KEY = process.env.NEWS_API_KEY;

export const newsScheduler = async () => {
  const categoryList = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];
  const URL = 'https://newsapi.org/v2/everything';

  let fromDateObj = new Date();
  // Subtract two day from current time
  fromDateObj.setDate(fromDateObj.getDate() - 2);
  let from = fromDateObj.toISOString();

  let to = new Date().toISOString();

  // 카테고리 하나씩 읽어오기
  for (let i = 0; i < categoryList.length; i++) {
    const category = categoryList[i];

    const response = await axios.get(URL, {
      params: {
        apiKey: API_KEY,
        q: category,
        domains: 'bloomberg.com,techcrunch.com',
        from,
        to,
        sortBy: 'relevancy',
      },
    });
    //console.log(response.data); // testing
    //console.log(category); // testing
  }
};
