// import { ModifiedPathsSnapshot } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user }  from "../models/user.model.js";
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

    const ExistedUser = await user.findOne({
        $or: [{ username },{ email }]
    }) 
    if (ExistedUser) {
        throw new ApiError(409, "😍username or email are already exists!..")
    }

    // const avatarLocalPath = req.files?.avatar?.[0]?.path        //temporary closed
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    // if (!avatarLocalPath) {
    //     throw new ApiError("😊avatar file is required!..")       //temporary closed
    // }
    if (!coverImageLocalPath) {
        throw new ApiError(400,"😊CoverImage file is required!..")
    }

    // const avatar = await UploadONCloudinary(avatarLocalPath)         //temporary closed
    const coverImage = await UploadONCloudinary(coverImageLocalPath)

    // if (!avatar) {
    //     throw new ApiError(400,"😊Avatar file is required!..")         //temporary closed
    // }
    if(!coverImage){
        throw new ApiError(400,"😊coverImage file is required!..")
    }
    const newuser = await user.create(
        {
            fullname,
            // avatar: avatar?.url || "",             //temporory closed
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        }
    )


    const createdUser = await newuser.findById(newuser._id).select(
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