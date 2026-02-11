import {Schema,model} from 'mongoose'
const userCommentSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    comment:{
        type:String
    }
})

const articalSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:[true,"authore id is required"]
    },
    title:{
        type:String,
        required:[true,"title is required"]
    },
    category:{
        type:String,
        required:[true,"category is required"]
    },
    content:{
        type:String,
        required:[true,"content is required"]
    },
    comments:[userCommentSchema],
    isArticalActive:{
        type:Boolean,
        default:true
    },
},
{
    timestamps:true,
    strict:"throw",
    versionKey:false
},
);
export const ArticleModel = model("article", articalSchema);