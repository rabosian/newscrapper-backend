import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import FavoriteArticle from "./FavoriteArticle";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required:true },
    favoriteArticleId:{ type:mongoose.ObjectId, ref:FavoriteArticle },
    level: { type: String, defualt:"user" } //default value should be defined.
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  // password가 없거나 password가 수정되지 않았을 때는 다음 미들웨어로 넘어감
  if (!this.password || !this.isModified('password')) {
    return next();
  } else {
    // password가 있을 때만 해싱
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  }
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, SECRET_KEY, {
      expiresIn: '48h',
    });
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
