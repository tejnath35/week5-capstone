import exp from "express";
import { authenticate, register } from "../Services/Auth-Service.js";
import { UserTypeModel } from "../Models/User-Model.js";
import { ArticleModel } from "../Models/Artical-Model.js";
import { checkAuthor } from "../Middlewares/Check-Author.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

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


//Create article(protected route)
authorRoute.post("/articles",verifyToken("AUTHOR") , async (req, res) => {
  //get article from req
  let article = req.body;

  //create article document
  let newArticleDoc = new ArticleModel(article);
  //save
  let createdArticleDoc = await newArticleDoc.save();
  //send res
  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});

//Read artiles of author(protected route)
authorRoute.get("/articles/:authorId",verifyToken("AUTHOR") ,checkAuthor, async (req, res) => {
  //get author id
  let aid = req.params.authorId;

  //read atricles by this author which are acticve
  let articles = await ArticleModel.find({ author: aid, isArticleActive: true }).populate("author", "firstName email");
  //send res
  res.status(200).json({ message: "articles", payload: articles });
});

//edit article(protected route)
authorRoute.put(
  "/articles",
  verifyToken("AUTHOR"),
  checkAuthor,
  async (req, res) => {
    try {
      // get modified article from req body
      let { articleId, title, category, content, author } = req.body;

      // find article
      let articleOfDB = await ArticleModel.findOne({
        _id: articleId,
        author: author,
      });

      if (!articleOfDB) {
        return res.status(404).json({ message: "Article not found" });
      }

      // update article
      let updatedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        {
          $set: { title, category, content },
        },
        { new: true }
      );

      res.status(200).json({
        message: "Article updated",
        payload: updatedArticle,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
// soft delete article
authorRoute.patch(
  "/articles/:articleId/status",
  verifyToken("AUTHOR"),
  async (req, res) => {

    const { articleId } = req.params;

    let article = await ArticleModel.findByIdAndUpdate(
      articleId,
      { isArticleActive: false },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    res.status(200).json({
      message: "article soft deleted",
      payload: article
    });
  }
);