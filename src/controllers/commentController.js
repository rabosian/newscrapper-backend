import Comment from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const { userId, articleId, content } = req.body;
    const newComment = new Comment({
      userId,
      articleId,
      content,
    });
    await newComment.save();
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'failed', error: err.message });
  }
};

export const getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.body;
    const commentList = await Comment.find({ articleId });
    res.status(200).json({ status: 'success', commentList });
  } catch (err) {
    res.status(400).json({ status: 'failed', error: err.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findOneAndDelete(id);
  } catch (err) {
    res.status(400).json({ status: 'Failed', error: err.message });
  }
};
