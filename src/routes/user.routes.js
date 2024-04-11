import express from "express";
import {loginUser, logoutUser, registerUser} from '../controllers/user.controller.js'
import upload from "../middlewares/multer.mw.js"
import { verifyJwt } from "../middlewares/auth.mw.js";
const router=express.Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
]),
    registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(
    verifyJwt,
    logoutUser
)
export default router;