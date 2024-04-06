import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        maxlength:32,
        index:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        maxlength:32,
        index:true
    },
    avatar:{
        type:String,
        trim:true,
        required:true
    },
    coverimage:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    watchlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    refreshToken:{
        type:String
    },
    },{timestamps:true}
);

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,12);
    }
    next();
})
userSchema.methods.isCorrectPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
    
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME})
    
}

export const User=mongoose.model("User",userSchema);