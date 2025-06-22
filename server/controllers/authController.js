import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../config/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();

export const signUpController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please login",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      opt: otp,
      role,
    });

    // Send verification email
    await sendEmail({
      sendTo: email,
      subject: "Verify your email from YourApp",
      html: `Your OTP is ${otp}`,
    });

    // Generate JWT token
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    newUser.token = token;
    await newUser.save();

    // Set cookie
    res.cookie("sessionToken", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "Lax", // "None" for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new Error("missing data");
    }

    const isExiting = await UserModel.findOne({ email });

    if (!isExiting) {
      return res.status(403).json({
        message: "user not exist",
        error: true,
        success: false
      })
    }

    const { opt } = isExiting;
    console.log(opt);
    if (otp !== opt) {
      throw new Error("invalid otp")
    }

    isExiting.opt = null;
    isExiting.isVarified = true;

    await isExiting.save();

    return res.status(200).json({
      message: "user verification successful",
      error: false,
      success: true,
      isExiting
    })

  }
  catch (error) {
    return res.status(404).json({
      message: error.message,
      error: true,
      success: false
    })
  }
}

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password", success: false });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.token = token;
    await user.save();

    res.cookie("sessionToken", token, {
      httpOnly: true,
      // secure: false, // true in production with HTTPS
      secure: process.env.NODE_ENV === 'production',
      // sameSite: "Lax", // "None" for cross-origin
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pass:user.password,
        token:user.token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.sessionToken;
    if (!token) return res.status(401).json({ message: "Unauthorized, please login", success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    const { sessionToken } = req.cookies;

    if (sessionToken) {
      try {
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id);
        if (user) {
          user.token = null;
          await user.save();
        }
      } catch (err) {
        console.log("Token invalid or expired:", err.message);
      }
    }

    res.clearCookie("sessionToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed: " + error.message,
    });
  }
};

export const updateUser = async (req, res) => {

  try {
    const { email, password, mobile, otp } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("user not found");
    }

    if (user.opt != otp) {
      throw new Error("Error, otp expired or incorrect");
    }

    user.mobile = mobile;
    user.isVarified = true;
    // user.otp = null;

    await user.save();

    return res.status(200).json({
      message: "updation successfull",
      error: false,
      success: true,
      data: user
    })
  } catch (error) {
    return res.status(404).json({
      message: error.message,
      error: true,
      success: false
    })
  }
}

export const deleteUserOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const isUser = await UserModel.findOne({ email });

    if (!isUser) {
      throw new Error("user not found");
    }

    const otp = Math.floor((Math.random() * 8999) + 1000);

    const emailResponse = await sendEmail({
      sendTo: email,
      subject: 'otp for deletion of your account',
      html: `your opt is ${otp}`
    });

    isUser.opt = otp;

    return res.status(200).json({
      message: "otp send successfully",
      error: false,
      success: true,
      isUser
    })


  } catch (error) {
    return res.status(404).json({
      message: error.message,
      error: true,
      success: false
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new Error("missing data");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("user not found");
    }
    if (user.opt != otp) {
      throw new Error("Error, otp expired or incorrect");
    }
    const userEmail = user.email;
    const userName = user.name;

    await UserModel.deleteOne(user);

    return res.status(200).json({
      message: "deleted successfully",
      success: true,
      error: false,
      data: userName, userEmail
    })
  } catch (error) {
    return res.status(404).json({
      message: error.message,
      error: true,
      success: false
    })
  }
}