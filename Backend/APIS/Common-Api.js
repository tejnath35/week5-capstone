import exp from "express";
export const commonRoute = exp.Router();
import { verifyToken } from "../Middlewares/verifyToken.js";
import { authenticate } from "../Services/Auth-Service.js";
import { UserTypeModel } from "../Models/User-Model.js";
import bcrypt from "bcryptjs";
import { ArticleModel } from "../Models/Artical-Model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Public read-only feed used by the home page.
commonRoute.get("/articles", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  try {
    const articles = await ArticleModel.find({ isArticleActive: true })
      .populate("author", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "articles", payload: articles });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch articles" });
  }
});

//login
commonRoute.post("/login", async (req, res) => {
  try {
    //get user cred object
    let userCred = req.body;
    //call authenticate service
    let { token, user } = await authenticate(userCred);
    //save token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    //send res
    res.status(200).json({ message: "login success", payload: user, token });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Login failed" });
  }
});

//logout for User, Author and Admin
commonRoute.get('/logout', (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

//change password
commonRoute.put('/change-password', async (req, res) => {
  //get current password and new password
  let { currentPassword, newPassword } = req.body;
  //check the current password is correct
  let user = await authenticate({ email: req.user.email, password: currentPassword });
  if (!user) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  //replace the current password with new password
  user.password = newPassword;
  await user.save();
});

// Request a verification code before allowing a password reset.
commonRoute.post('/forgot-password/request', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await UserTypeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }
    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ message: "Email service is not configured" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "MyBlog password verification code",
      text: `Your MyBlog password verification code is ${verificationCode}. It expires in 10 minutes.`,
    });

    user.passwordResetCode = verificationCode;
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    res.status(200).json({ message: "Verification code sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error generating verification code", error: error.message });
  }
});

commonRoute.post('/forgot-password/reset', async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    if (!email || !verificationCode || !newPassword) {
      return res.status(400).json({ message: "Email, verification code and new password are required" });
    }

    const user = await UserTypeModel.findOne({
      email,
      passwordResetCode: verificationCode,
      passwordResetExpiresAt: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetCode = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
});

commonRoute.get("/check-auth", verifyToken(), async (req, res) => {
  try {
    const user = await UserTypeModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({
      message: "Authenticated",
      payload: userObj,
    });
  } catch (err) {
    res.status(500).json({ message: "Error checking auth", error: err.message });
  }
});

commonRoute.get("/activity", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  try {
    const userId = req.user.userid;
    const articles = await ArticleModel.find({ isArticleActive: true })
      .populate("author", "firstName lastName")
      .sort({ updatedAt: -1 });
    const likedArticles = articles.filter((article) =>
      article.likes.some((likeId) => likeId.toString() === userId)
    );
    const commentedArticles = articles.filter((article) =>
      article.comments.some((comment) => comment.user?.toString() === userId)
    );
    const authoredArticles = articles.filter((article) => article.author?._id?.toString() === userId);
    res.status(200).json({
      message: "activity",
      payload: { likedArticles, commentedArticles, authoredArticles },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch activity" });
  }
});