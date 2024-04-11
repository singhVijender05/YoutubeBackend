import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const genTokens=async function(user){
  try{
    console.log(user)
    const accessToken= user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    console.log("generated tokens in genTokens ",accessToken," ",refreshToken)
    console.log("user in genTokens ",user);
    //refresh token db me store karte hai
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
  }
  catch(error){
    throw new ApiError(500,error.message)
  }
}
const registerUser=asyncHandler(async (req,res)=>{
  //get user details from frontend
  //validatin -not empty etc.
  //check if user already exists: username,email
  //check for images, check for avatar(required)
  //upload them to cloudinary
  //create user object- create entry in db
  //remove password and refresh toke field from response
  //check for user creation
  //return res

  console.log(req.body)
  const {fullname,email,username,password}=req.body;
//   console.log(res)
  if([fullname,email,username,password].some((field)=>field.trim()==="")){
    throw new ApiError(400,"all fields are compulsory")
  }

  //check if user exists
  const existedUser= await User.findOne({
    $or:[{email},{username}]
  })
  if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
  }

  // console.log("request files ",req.files)
  const avatarLocalPath=req.files.avatar[0].path;
  const coverLocalPath=req.files.coverimage[0].path;
  console.log("avatar local path: ,"+avatarLocalPath);
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required");
  }

  //upload on cloudinary
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverLocalPath)
  if(!avatar){
    throw new Error(409,"avatar file required")
  }

  //upload on db
  const user= await User.create({
    fullname:fullname,
    avatar:avatar.url,
    coverimage:coverImage.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser= await User.findById(user._id).select(
    "-password -refreshtoken"
  )
  if(!createdUser){
    throw new ApiError(501,"server error ")
  }

  return res.status(201).json(
     new ApiResponse(200,createdUser,"user registered successfully")
  )
})

const loginUser=asyncHandler(async (req,res)=>{
  //username or email
  //find user
  //password
  //if matches , send access and refresh token
  //send through secure cookies

  const {email,username,password}=req.body;
  console.log("credentials received in login ",email," ",password)
  if(!username && !email){
    throw new ApiError(400,"username or password required")
  }

  //find user
  const existsUser=await User.findOne({
    $or:[{username},{email}]
  })
  console.log("existing user in login ",existsUser)
  if(!existsUser) throw new ApiError(404,"User does not exist")

  const passwordMatch= await existsUser.isCorrectPassword(password);
  
  if(!passwordMatch){
    throw new ApiError(401,"Password Incorrect");
  }

  const {accessToken,refreshToken}=await genTokens(existsUser)

  const modifiedUser=await User.findById(existsUser._id).select("-password -refreshToken")
  //send token through secure cookies
  const options={
    httpOnly:true, //only modifiable from server now
    secure:true
  }
  return res.status(200).
  cookie("accessToken",accessToken,options).
  cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user: modifiedUser,refreshToken,accessToken
      },
      "user logged in successfully"
    )
  )

})

const logoutUser=asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(req.user._id,
    {
    $set:{
      refreshToken: undefined
    }
  },
    {
      new: true
    }
  )
  const options={
    httpOnly:true,
    secure:true
  }
  return res.
  status(200).
  clearCookie("accessToken",options).
  clearCookie("refreshToken",options).
  json(new ApiResponse(200,{},"user logged out"))
})

export {registerUser,loginUser,logoutUser}