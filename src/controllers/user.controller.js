// import { ModifiedPathsSnapshot } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user }  from "../models/user.model.js";
import { UploadONCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const newuser = await user.findById(userId)
        const AccessToken = newuser.genaratAccessToken()
        const refreshToken = newuser.genaratRefreshToken()

        newuser.refreshToken = refreshToken
        await newuser.save({validationBeforeSave: false})

        return {refreshToken,AccessToken}


    } catch (error) {
        throw new ApiError(500,"something went wrong while generate Access and Refresh Tokens ")
    }
}

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
    // console.log("email:",email)

    if (
        [fullname,email,username,password].some( (field) => 
        field?.trim()=== "" )
    ) {
        throw new ApiError(400,"😊All fields are required  ")
    }
    // console.log(req.files)
    

    const ExistedUser = await user.findOne({
        $or: [{ username },{ email }]
    }) 
    if (ExistedUser) {
        throw new ApiError(409, "😍username or email are already exists!..")
    }
    // console.log(req.files)

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


const loginUser = asyncHandler(async(req,res)=>{

    // req.body -> data
    // username or email
    // find the user
    // password check
    // access,refresh token
    // send cookie



    const {username,email} = req.body

    if (!username || !email) {
        throw new ApiError(400,"username or email is required")
    }

    const newuser = await user.findOne({
        $or:[{username},{email}]
    })

    if (!newuser) {
        throw new ApiError(404,"user does not exist")
    }

    const ispasswordvalid = await newuser.isPasswordCorrect(password)

    if (!ispasswordvalid) {
        throw new ApiError(401,"invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(newuser._id)

    const loggedInUser = await user.findById(newuser._Id)
    select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                newuser: loggedInUser,accessToken,refreshToken
            },
            "user logged In successfully "
        )
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    user.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearcookie("accessToken")
    .clearcookie("refreshToken")
    .json(new ApiResponse(200,{},"user logged out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}