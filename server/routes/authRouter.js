import express from "express";
import { loginValidiator, signupValidiation } from "../middlewares/authmiddleware.js";
import { deleteUser, deleteUserOtp, getUser, loginController, logout, signUpController, updateUser, verifyOtp } from "../controllers/authController.js";
import auth from "../middlewares/auth.js";
import UserModel from "../models/user.model.js";

const router = express.Router();

router.post('/registerUser',signupValidiation,signUpController);

router.post('/getUser',getUser);

router.post('/login',loginValidiator,loginController);

router.post('/verifyOtp', verifyOtp);

router.post('/logout',logout);

router.put('/update',updateUser);

router.post('/deleteOtp', deleteUserOtp);

router.post('/deleteUser', deleteUser);

router.get("/users", async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

export default router ;