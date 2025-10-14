import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParse())

// routes
import userRouter from "./routes/user.route.js"


//routes decleration
app.use("/api/v1/users",userRouter)

// http://localhost:8000/api/v1/users/register


// console.log("Registered routes:");
// app._router.stack
//   .filter(r => r.route)
//   .forEach(r => {
//     const methods = Object.keys(r.route.methods).join(", ").toUpperCase();
//     console.log(`${methods} ${r.route.path}`);
//   });


export { app }