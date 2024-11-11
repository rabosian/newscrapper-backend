import mongoose from "mongoose";
const Schema = mongoose.Schema;
import User from "./User";

const favoriteArticleSchema = new mongoose.Schema({
    userId:{ type:mongoose.ObjectId, ref:User },
    articles:[{
        articleTitle:{ type:String, required:true },
        articleContents:{ type:String, required:true },
        category:{ type:String, required:true },
        author:{ type:String, required:true },
        date:{ type:Date, required:true },
        likes:{ type:Number, required:true }
    }],
}, { timestamps:true });

favoriteArticleSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v
    delete obj.updateAt
    delete obj.createAt
    return obj
};

const FavoriteArticle = mongoose.model("FavoriteArticle", favoriteArticleSchema);
export default FavoriteArticle;