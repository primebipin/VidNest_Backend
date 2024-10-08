import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
// import { Video } from "../models/video.models.js";
// import { app } from "../app.js";
// import cookieParser from "cookie-parser";

export const verifyJWT = asyncHandler(async(req, _, next) => {
   try {
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
       
    //    console.log(token);
       if (!token) {
           throw new ApiError(401, "Unauthorized request")
       }
   
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
   
       const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
   
       if (!user) {
           
           throw new ApiError(401, "Invalid Access Token")
       }
    //    console.log(user);
   
       req.user = user;
       next()
   } catch (error) {
       throw new ApiError(401, error?.message || "Invalid access token")
   }
   
})

export  default verifyJWT  