import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: User,
      required: true,
    },
    articleId: {
      type: mongoose.ObjectId,
      ref: Article,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
    like_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

commentSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
};

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
