import exp from "express";
import { register,authenticate} from "../Services/auth-service.js";
import { UserTypeModel } from "../models/user-model.js";
import { ArticleModel } from "../models/artical-model.js";
import { checkAuthor } from "../middlewares/check-author.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import mongoose from "mongoose";
export const authorRoute = exp.Router();

//Register author(public)
authorRoute.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({ ...userObj, role: "AUTHOR" });
  //send res
  res.status(201).json({ message: "authroe created", payload: newUserObj });
});
//authenticate author(public)
// create article
authorRoute.post('/articles',verifyToken,checkAuthor, async (req, res) => {
  let article = req.body;

  let newArticleDoc = new ArticleModel(article);
  let createdArticleDoc = await newArticleDoc.save();

  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});


//Read artiles of author(protected route)
authorRoute.get("/articles/:authorId",verifyToken ,checkAuthor, async (req, res) => {
  //get author id
  let aid = new mongoose.Types.ObjectId(req.params.authorId);

  //read atricles by this author which are acticve
  let articles = await ArticleModel.find({ author: aid, isArticalActive: true }).populate("author", "firstName email");
  //send res

  res.status(200).json({ message: "articles", payload: articles });
});
//edit article(protected route)
authorRoute.put("/articles",verifyToken ,checkAuthor,async (req, res) => {
  //get modified article from req
  let { articleId, title, category, content,author } = req.body;
  //find article
  let articleOfDB = await ArticleModel.findOne({_id:articleId,author:author});
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }
  
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});

// soft delete article
authorRoute.delete('/articles/:articleId', async (req, res) => {
  const { articleId } = req.params;

  let article = await ArticleModel.findById(articleId);
  if (!article) {
    return res.status(404).json({ message: "article not found" });
  }

  article.isArticalActive = false;
  await article.save();

  res.status(200).json({ message: "article deleted (soft)" });
});
