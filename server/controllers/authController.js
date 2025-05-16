import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../config/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();

export const signUpController = async (request, res) => {
    try {
        const { name, email, password ,role } = request.body;

        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(409).json({
                message: "user already exist ,please login ",
                success: false
            });
        }
        const hashPass = await bcrypt.hash(password, 10);

        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

        const newUser = await UserModel.create({
            name, email, password: hashPass, opt: otp, role
        })

        const emailResponse = await sendEmail({
            sendTo: email,
            subject: 'Verify your email from YourApp',
            html: `your opt is ${otp}`
        });

        // if (emailResponse.error) {
        //     return res.status(500).json({
        //         message: "User registered, but verification email failed to send.",
        //         error: true,
        //         success: false,
        //         newUser
        //     });
        // }

        return res.status(201).json({
            success: true,
            message: "sign up successfully",
            data: {
                newUser
            }
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

export const getUser = async (req, res) => {
    // const { id } = req.params;
//     const {email} = req.body;
//     const user  = await UserModel.findOne({email});
//     return res.json({
//         data: user
//     })
// }  const token = req.cookies.token;
try {
    console.log("Cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ data: user });
  } catch (err) {
    console.error("getUser error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
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
        secure: false, // true in production with HTTPS
        sameSite: "Lax",
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
          },
      });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
};
  
export const logout = async (req, res) => {
    try {
        const { sessionToken } = req.cookies;

        if (!sessionToken) {
            throw new Error("Unauthorized access: session token not found.");
        }

        let decodeData;
        try {
            decodeData = await jwt.verify(sessionToken, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Session expired, please log in again.", error: true });
            }
            return res.status(401).json({ message: "Invalid or expired session token.", error: true });
        }

        const { _id, email, role } = decodeData;

        const isUser = await UserModel.findById(_id);

        if (!isUser) {
            throw new Error("Unauthorized access: user not found.");
        }

        // If your token is stored in the user's document, clear it
        isUser.token = null;
        await isUser.save();

        // Clear session cookie
        res.clearCookie("sessionToken");

        return res.status(200).json({
            message: "User logged out successfully.",
            error: false,
            success: true,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
            error: true,
            success: false
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
        const {email} = req.body;

        const isUser = await UserModel.findOne({email});

        if(!isUser){
            throw new Error("user not found");
        }

        const otp = Math.floor((Math.random()*8999)+1000);

        const emailResponse = await sendEmail({
            sendTo: email,
            subject: 'otp for deletion of your account',
            html: `your opt is ${otp}`
        });

        isUser.opt = otp;

        return res.status(200).json({
            message:"otp send successfully",
            error: false,
            success:true,
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
        const { email , otp } = req.body;

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
        const userName = user.name ;

        await UserModel.deleteOne(user);

        return res.status(200).json({
            message:"deleted successfully",
            success:true,
            error:false,
            data : userName,userEmail
        })
    } catch (error) {
        return res.status(404).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}