import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchama = new Schema(
    {
        username:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim: true,
            index : true
        },
         email:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim: true
        },
         fullname:{
            type : String,
            required : true,
            trim: true,
            index : true
        },
         avatar:{
            type : String,
            required : true
        },
         coverimage:{
            type : String
        },
         watchHistory:[
            {
            type : Schema.Types.ObjectId,
            ref : "video"
            },
         ],
         password:{
            type : String,
            require: [true,"password is required"]
         },
         refreshtoken:{
            type: String
         }

    },
    {
        timestamps:true
    }
)

userSchama.pre("save",async function(next) {
    if(!this.isModified("password")) return next()
        this.password = bcrypt.hash(this.password,10)
    next()
})

userSchama.methods.isPasswordCorrect = async function
(password){
    return await bcrypt.compare(password,this.password)
}

userSchama.methods.genaratAccessToken = function(){
    return jwt.sigh(
        {
            _id: this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
userSchama.methods.genaratRefreshToken = function(){
    return jwt.sigh(
        {
            _id: this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        }
    )
}

export const User = mongoose.model("User",userSchama)