import exp from 'express'
import { register} from "../Services/Auth-Service.js";
import { ArticleModel } from '../Models/Artical-Model.js';
import { UserTypeModel } from '../Models/User-Model.js';
import { verifyToken } from '../Middlewares/verifyToken.js';

export const userRoute = exp.Router();

// register user
userRoute.post('/users', async (req, res) => {
  try {
    let userObj = req.body;
    const newUserObj = await register({ ...userObj, role: "USER" });
    res.status(201).json({ message: "user created", payload: newUserObj });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "User registration failed" });
  }
});

// get user profile
userRoute.get('/profile', verifyToken("USER"), async (req, res) => {
  try {
    const userId = req.user.userid;
    const user = await UserTypeModel.findById(userId).select('firstName lastName email profileImageUrl');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User profile", payload: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update profile image
userRoute.put('/profile-image', verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
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
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "Profile image updated", payload: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
userRoute.post('/articles/:articleId/comments', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId } = req.params;
    const { comment } = req.body;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    article.comments.push({ user: userId, comment });
    await article.save();

    res.status(201).json({ message: "comment added", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get single article
userRoute.get('/article/:id', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id)
      .populate('author', 'firstName lastName')
      .populate('comments.user', 'firstName lastName profileImageUrl')
      .populate('comments.replies.user', 'firstName lastName profileImageUrl');
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "article", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// toggle like on an article
userRoute.post('/articles/:articleId/like', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    const likeIndex = article.likes.indexOf(userId);
    const dislikeIndex = article.dislikes.indexOf(userId);

    // If already liked, remove like
    if (likeIndex !== -1) {
      article.likes.splice(likeIndex, 1);
    } else {
      // Add like
      article.likes.push(userId);
      // Remove dislike if it exists
      if (dislikeIndex !== -1) {
        article.dislikes.splice(dislikeIndex, 1);
      }
    }

    await article.save();
    res.status(200).json({ message: "Like toggled", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// toggle dislike on an article
userRoute.post('/articles/:articleId/dislike', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    const likeIndex = article.likes.indexOf(userId);
    const dislikeIndex = article.dislikes.indexOf(userId);

    // If already disliked, remove dislike
    if (dislikeIndex !== -1) {
      article.dislikes.splice(dislikeIndex, 1);
    } else {
      // Add dislike
      article.dislikes.push(userId);
      // Remove like if it exists
      if (likeIndex !== -1) {
        article.likes.splice(likeIndex, 1);
      }
    }

    await article.save();
    res.status(200).json({ message: "Dislike toggled", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a comment
userRoute.delete('/articles/:articleId/comments/:commentId', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    // check if user owns the comment or is the article author
    if (comment.user.toString() !== userId && article.author.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to delete this comment" });
    }

    article.comments.pull(commentId);
    await article.save();
    await article.populate("author");
    await article.populate("comments.user");
    await article.populate("comments.replies.user");

    res.status(200).json({ message: "comment deleted", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// edit a comment
userRoute.put('/articles/:articleId/comments/:commentId', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const { comment: updatedText } = req.body;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    // ONLY the user who wrote the comment can edit it
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not allowed to edit this comment" });
    }

    comment.comment = updatedText;
    await article.save();
    await article.populate("author");
    await article.populate("comments.user");
    await article.populate("comments.replies.user");

    res.status(200).json({ message: "comment updated", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add a reply to a comment
userRoute.post('/articles/:articleId/comments/:commentId/reply', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const { comment: replyText } = req.body;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    comment.replies.push({ user: userId, comment: replyText });
    await article.save();
    await article.populate("author");
    await article.populate("comments.user");
    await article.populate("comments.replies.user");

    res.status(201).json({ message: "reply added", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// toggle like on a comment
userRoute.post('/articles/:articleId/comments/:commentId/like', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    const likeIndex = comment.likes.indexOf(userId);
    const dislikeIndex = comment.dislikes.indexOf(userId);

    if (likeIndex !== -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userId);
      if (dislikeIndex !== -1) {
        comment.dislikes.splice(dislikeIndex, 1);
      }
    }

    await article.save();
    await article.populate("author");
    await article.populate("comments.user");
    await article.populate("comments.replies.user");
    res.status(200).json({ message: "Comment like toggled", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// toggle dislike on a comment
userRoute.post('/articles/:articleId/comments/:commentId/dislike', verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const userId = req.user.userid;

    let article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    const likeIndex = comment.likes.indexOf(userId);
    const dislikeIndex = comment.dislikes.indexOf(userId);

    if (dislikeIndex !== -1) {
      comment.dislikes.splice(dislikeIndex, 1);
    } else {
      comment.dislikes.push(userId);
      if (likeIndex !== -1) {
        comment.likes.splice(likeIndex, 1);
      }
    }

    await article.save();
    await article.populate("author");
    await article.populate("comments.user");
    await article.populate("comments.replies.user");
    res.status(200).json({ message: "Comment dislike toggled", payload: article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
