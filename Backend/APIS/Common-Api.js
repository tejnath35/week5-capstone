import exp from "express";
export const commonRoute = exp.Router();
import { verifyToken } from "../Middlewares/verifyToken.js";
import { authenticate } from "../Services/Auth-Service.js";
import { UserTypeModel } from "../Models/User-Model.js";
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    //send res
    res.status(200).json({ message: "login success", payload: user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Login failed" });
  }
});

//logout for User, Author and Admin
commonRoute.get('/logout', (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie('token', {
    httpOnly: true, // Must match original settings
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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