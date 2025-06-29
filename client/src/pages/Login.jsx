import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { FaDumbbell, FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { setAuthenticated } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const endpoint = isLogin ? "login" : "registerUser";
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };

      const response = await axios.post(
        `https://gym-project-server.onrender.com/auth/${endpoint}`,
        payload,
        {
          withCredentials: true,
        }
      );

      const token = response.data.token || response.data.user?.token;
      const userPayload = response.data.user;

      if (!token || !userPayload) {
        throw new Error("Token or user data missing from response");
      }

      localStorage.setItem("token", token);
      await login({ token, user: userPayload });
      setAuthenticated(true);

      toast.success(`${isLogin ? "Login" : "Signup"} successful!`);
      reset();

      if (userPayload.email === "admin@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(
        `${isLogin ? "Login" : "Signup"} failed: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="bottom-right" richColors />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <FaDumbbell className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create new account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-blue-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            )}
            <div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-blue-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
          >
            {isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleForm}
            className="text-sm text-blue-500 hover:text-red-600 transition"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
