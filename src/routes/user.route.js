import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route ("/register").post(registerUser)



export default router



// import { Router } from "express";
// const router = Router();

// router.post("/register", (req, res) => {
//   console.log("Route hit");
//   res.json({ message: "Route works!" });
// });

// export default router;




// router.post("/register", (req, res) => {
//   console.log("Hit /register route");
//   res.status(200).json({ message: "route works!" });
// });