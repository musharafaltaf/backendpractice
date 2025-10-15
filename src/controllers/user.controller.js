import { ModifiedPathsSnapshot } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { UploadONCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async(req,res) => {

            // ALGORITHMS 
    // GET USER DETAILS FROM FRONTENT
    // VALIDATION - NOT EMPTY
    // CHECK IF USER ALREADY EXISTS  USERNAME,EMAIL
    // CHECK FOR IMAGES, CHECK FOR AVATAR
    // UPLOAD THEM TO CLOUDINARY, AVATAR
    // CREATE USER OBJECT - CREATE ENTRY IN DB
    // REMOVE PASSWORD AND REFRESH TOKEN FIELD FROM RESPONSE
    // CHECK FOR USER CREATION
    // RETURN RES


    const {fullname, email, username, password} = req.body
    console.log("email:",email)

    if (
        [fullname,email,username,password].some( (field) => 
        field?.trim()=== "" )
    ) {
        throw new ApiError(400,"😊All fields are required  ")
    }

    const ExistedUser = user.findOne({
        $or: [{ username },{ email }]
    }) 
    if (ExistedUser) {
        throw new ApiError(409, "😍username or email are already exists!..")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path 
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400,"😊avatar file is required!..")
    }
    if (!coverImageLocalPath) {
        throw new ApiError(400,"😊CoverImage file is required!..")
    }

    const avatar = await UploadONCloudinary(avatarLocalPath)
    const coverimage = await UploadONCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"😊Avatar file is required!..")
    }
    if(!coverimage){
        throw new ApiError(400,"😊coverImage file is required!..")
    }
    const user = await user.create(
        {
            fullname,
            avatar: avatar.url,
            coverimage: coverimage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        }
    )


    const createdUser = await user.findById(user._id).select(
        "-password -refreshtoken"
    )

    if (!createdUser) {
        throw new ApiError(500,"😒something went wrong while registering the user!..")
    }
    
    return res.status(201).json(
        new ApiResponse(200,createdUser, "✅Successfully Registered")
    )
})

export {
    registerUser
}