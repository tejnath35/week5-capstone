import {Schema,model} from 'mongoose'
const replySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    comment: {
        type: String
    }
}, { timestamps: true });

const userCommentSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    comment:{
        type:String
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }],
    dislikes:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }],
    replies: [replySchema]
}, { timestamps: true });

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
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }],
    dislikes:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }],
    comments:[userCommentSchema],
    isArticleActive:{
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
