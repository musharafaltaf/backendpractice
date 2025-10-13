
import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/index.js"
// import { app } from "./app.js";  // ✅ import your express app


dotenv.config({
    path: "./env"
})

const app = express();


connectDB()
.then(()=>{
    
    app.listen(process.env.PORT || 4000, ()=>{
        console.log(`👌server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed!!!",err)
})


















// import mongoose from "mongoose";
// import {db_name} from "./constants";

// import express from "express";
// const app = express;

// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`)
//         app.on("errror",(error)=>{
//             console.log("ERRR",error)
//             throw err
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port $ {process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("Error:",error)
//         throw err;
//     }
// })()