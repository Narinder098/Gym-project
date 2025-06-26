import express from "express";
import { loginValidiator, signupValidiation } from "../middlewares/authmiddleware.js";
import { deleteUser, deleteUserOtp, getUser, loginController, logout, signUpController, updateUser, verifyOtp } from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";
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

// Get all users (requires authentication)
router.get("/users", auth, async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("name email membershipType status createdAt role")
      .lean();
    res.json({ success: true, users });
  } catch (err) {
    console.error("getUsers - Error:", err);
    res.status(500).json({ success: false, message: "Server error: Unable to fetch users" });
  }
});

// Update membership (requires admin)
router.patch("/updateMembership/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    const { membershipType } = req.body;
    if (!["Basic", "Premium", "Pro"].includes(membershipType)) {
      return res.status(400).json({ success: false, message: "Invalid membership type" });
    }
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { membershipType },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("updateMembership - Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update status (requires admin)
router.patch("/updateStatus/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    const { status } = req.body;
    if (!["Active", "Inactive", "Suspended"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("updateStatus - Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete user (requires admin)
router.delete("/deleteUser/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("deleteUser - Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update user (requires admin)
router.patch("/updateUser/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    const { name, email } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("updateUser - Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/membership/:userId", auth, async (req, res) => {
  const user = await UserModel.findById(req.params.userId).select("membershipType membershipEndDate");
  res.json({ success: true, membership: { plan: user.membershipType, endDate: user.membershipEndDate } });
});

router.patch("/membership/:userId", auth, async (req, res) => {
  const { plan } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.params.userId,
    { membershipType: plan, membershipEndDate: new Date(/* calculate end date */)},
    { new: true }
  );
  res.json({ success: true, membership: { plan: user.membershipType, endDate: user.membershipEndDate } });
});

router.get('/admin/dashboard-stats', auth,isAdmin, async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalExercises = await ExerciseModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();
    const totalOrders = await OrderModel.countDocuments();

    res.json({ totalUsers, totalExercises, totalProducts, totalOrders });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});


export default router;