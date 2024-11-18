import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    source: { type: Object, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String, required: true }, //this is description in NEWS Api
    deleteFlag: { type: Boolean, required: true, default: true },
    publishedAt: { type: Date, required: true },
    category: { type: String, required: true },
    url: { type: String, required: true },
    urlToImage: { type: String, required: true },
    comments: [
      {
        type: mongoose.ObjectId,
        ref: 'Comment',
      },
    ],
    views: { // 조회수
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

articleSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const Article = mongoose.model('Article', articleSchema);
export default Article;
