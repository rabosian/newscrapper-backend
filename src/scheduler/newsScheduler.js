import dotenv from 'dotenv';
import axios from 'axios';
import Article from '../models/Article.js';
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

  const articleCount = await Article.countDocuments();

  if (articleCount > 1000) return; // 1000개 뉴스가 데이터베이스에 저장되면 newsScheduler 작동 안함
  // 오래된뉴스 삭제될때까지

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

    // 들고온 뉴스들 데이터베이스에 저장
    await Article.insertMany(
      response.data.articles.map((article) => {
        return {
          source: article.source,
          title: article.title,
          content: article.content,
          summary: article.description,
          deleteFlag: true,
          publishedAt: article.publishedAt,
          category: category,
          url: article.url,
          urlToImage: article.urlToImage,
          comments: [],
        };
      })
    );

    //console.log(response.data); // testing
    //console.log(category); // testing
  }
};
