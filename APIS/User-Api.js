import exp from 'express'
import { register} from "../Services/Auth-Service.js";
import { ArticleModel } from '../Models/Artical-Model.js';
import { verifyToken } from '../Middlewares/verifyToken.js';

export const userRoute = exp.Router();

// register user
userRoute.post('/users', async (req, res) => {
  let userObj = req.body;
  const newUserObj = await register({ ...userObj, role: "USER" });
  res.status(201).json({ message: "user created", payload: newUserObj });
});

// read all articles
userRoute.get('/articles', verifyToken("USER"), async (req, res) => {
  try {
    const articles = await ArticleModel.find();
    res.status(200).json({ message: "articles", payload: articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// add comment to an article
userRoute.post('/articles/:articleId/comments', async (req, res) => {
  const { articleId } = req.params;
  const { user, comment } = req.body;

  let article = await ArticleModel.findById(articleId);
  if (!article) {
    return res.status(404).json({ message: "article not found" });
  }

  article.comments.push({ user, comment });
  await article.save();

  res.status(201).json({ message: "comment added", payload: article });
});


