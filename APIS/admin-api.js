import exp from'express';
import { register} from "../Services/Auth-Service.js";
import { ArticleModel } from '../models/Artical-Model.js';
import { UserTypeModel } from '../models/User-Model.js';
export const adminRoute=exp.Router();
//authenticate admin(protected route)
adminRoute.post('/users', async (req, res) => {
    let userObj = req.body;
    const newUserObj = await register({ ...userObj, role: "ADMIN" });
    res.status(201).json({ message: "admin created", payload: newUserObj });
});

//read all articles
adminRoute.get('/articles', async (req, res) => {
  let articles = await ArticleModel.find();
  res.status(200).json({ message: "articles", payload: articles });
});
//block
adminRoute.put('/block/:authorId',async (req, res) => {
    let authorId=req.params.authorId;
    let author =await UserTypeModel.findById(authorId);
    if(!author){
        return res.status(404).json({message:"author not found"});
    }   
    author.isActive=false;
    await author.save();
    res.status(200).json({message:"author blocked"});
});
//unlock roles
adminRoute.put('/unblock/:authorId',async (req, res) => {
    let authorId=req.params.authorId;
    let author =await UserTypeModel.findById(authorId);
    if(!author){
        return res.status(404).json({message:"author not found"});
    }
    author.isActive=true;
    await author.save();
    res.status(200).json({message:"author unblocked"});
}
);

