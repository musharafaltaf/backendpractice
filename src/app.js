import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

// routes
import userRouter from "./routes/user.route.js"  // finally i was cached here (bug)=>..


//routes decleration
app.use("/api/v1/users",userRouter)











// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import multer from "multer";

// const app = express();
// const upload = multer({ dest: "uploads/" }); // auto creates temp files

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));

// // ✅ Place upload route here (before body parsers)
// app.post("/api/v1/upload", upload.single("file"), (req, res) => {
//     res.json({
//         success: true,
//         filename: req.file.filename,
//         originalname: req.file.originalname
//     });
// });

// // These stay for normal JSON requests
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(cookieParser());

// import userRouter from "./routes/user.route.js";
// app.use("/api/v1/users", userRouter);

// export { app };





















// http://localhost:8000/api/v1/users/register


// console.log("Registered routes:");
// app._router.stack
//   .filter(r => r.route)
//   .forEach(r => {
//     const methods = Object.keys(r.route.methods).join(", ").toUpperCase();
//     console.log(`${methods} ${r.route.path}`);
//   });






export { app }