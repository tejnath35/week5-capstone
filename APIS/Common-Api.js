import exp from "express";
export const commonRoute = exp.Router();
import { authenticate} from "../Services/Auth-Service.js";
//login
commonRoute.post("/login", async (req, res) => {
    //get user cred object
      let userCred = req.body;
      //call authenticate service
      let { token, user } = await authenticate(userCred);
      //save tokan as httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      //send res
      res.status(200).json({ message: "login success", payload: user });
    });

//logout for User, Author and Admin
commonRoute.get('/logout', (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie('token', {
    httpOnly: true, // Must match original  settings
    secure: false,   // Must match original  settings
    sameSite: 'lax' // Must match original  settings
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
