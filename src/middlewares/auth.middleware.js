import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer","")

    if (!Token) {
        throw new ApiError(401,"Unauthorized request")
    }
    
    const decodedtoken = jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET)

    const newuser = await user.findById(decodedtoken?._id).select("-password -refreshToken")

    if (!newuser) {
        throw new ApiError(401,"Invalid Access Token ")
    }

    req.newuser = newuser
    next()
})