import Article from '../models/Article.js';

export const cleanUpScheduler = async () => {
  let fromDateObj = new Date();
  fromDateObj.setDate(fromDateObj.getDate() - 8); //8일 지난 기사들 지우기

  const response = await Article.deleteMany({
    deleteFlag: true,
    publishedAt: { $lte: fromDateObj }, // AND filter
  }).exec();
};
