import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:32,
        index:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
        maxlength:1000
    },
    thumbnail:{
        type:String,
        required:true
    },
    videoLink:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}
    ,{timestamps:true});

export const Video=mongoose.model("Video",videoSchema);