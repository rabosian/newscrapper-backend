import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String },
    level: { type: String, default: 'user' }, //확장성을 위해 level을 남김
    // 일반 회원가입 시 기본 프로필 사진 default로 추가, 구글 로그인 시 controller에서 프로필 사진을 가져와서 저장
    picture: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/9385/9385289.png' },
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
