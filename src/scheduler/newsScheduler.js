import dotenv from 'dotenv';
import axios from 'axios';
import Article from '../models/Article.js';
import { NEWS_DOMAINS } from '../utils/domains.js';
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

    // DB에 있는 모든 기사들을 불러오기
    const existingArticles = await Article.find({});

    const response = await axios.get(URL, {
      params: {
        apiKey: API_KEY,
        q: category,
        domains: NEWS_DOMAINS,
        from,
        to,
        sortBy: 'relevancy',
      },
    });

    // 사이트들에서 기사들을 들고온 후, 타이틀을 기준으로 DB에 중복된 기사가 있는지 확인
    const filterArticles = response.data.articles.filter((article) => {
      for (let i = 0; i < existingArticles.length; i++) {
        if (article.title === existingArticles[i].title) return false;
      }
      return true;
    });

    // 들고온 뉴스들 데이터베이스에 저장
    await Article.insertMany(
      filterArticles.map((article) => {
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
