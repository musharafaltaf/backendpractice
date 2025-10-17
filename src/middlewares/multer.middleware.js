import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage,
})




// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp"); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// // Accept two specific file fields: avatar and coverImage
// export const upload = multer({ storage }).fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "coverImage", maxCount: 1 },
// ]);
