import exp from "express";
import { authenticate, register } from "../Services/Auth-Service.js";
import { UserTypeModel } from "../Models/User-Model.js";
import { ArticleModel } from "../Models/Artical-Model.js";
import { checkAuthor } from "../Middlewares/Check-Author.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

export const authorRoute = exp.Router();

//Register author(public)
authorRoute.post("/users", async (req, res) => {
  try {
    let userObj = req.body;
    const newUserObj = await register({ ...userObj, role: "AUTHOR" });
    res.status(201).json({ message: "author created", payload: newUserObj });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Author registration failed" });
  }
});

// get author profile
authorRoute.get("/profile", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const userId = req.user.userid;
    const user = await UserTypeModel.findById(userId).select('firstName lastName email profileImageUrl');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "Author profile", payload: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update profile image
authorRoute.put('/profile-image', verifyToken("AUTHOR", "ADMIN"), async (req, res) => {
  try {
    const userId = req.user.userid;
    const { profileImageUrl } = req.body;
    
    if (!profileImageUrl) {
      return res.status(400).json({ message: "profileImageUrl is required" });
    }

    const user = await UserTypeModel.findByIdAndUpdate(
      userId,
      { profileImageUrl },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "Author not found" });
    }
    
    res.status(200).json({ message: "Profile image updated", payload: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  let articles = await ArticleModel.find({ author: aid}).populate("author", "firstName email");
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
// soft delete OR restore article
authorRoute.patch(
  "/articles/:articleId/status",
  verifyToken("AUTHOR"),
  async (req, res) => {
    try {
      const { articleId } = req.params;
      const { isArticleActive } = req.body; // 

      let article = await ArticleModel.findByIdAndUpdate(
        articleId,
        { isArticleActive },
        { new: true }
      );

      if (!article) {
        return res.status(404).json({ message: "article not found" });
      }

      res.status(200).json({
        message: isArticleActive
          ? "article restored"
          : "article soft deleted",
        payload: article,
      });

    } catch (err) {
      res.status(500).json({
        message: "error updating article",
        error: err.message,
      });
    }
  }
);