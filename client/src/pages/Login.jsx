import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { FaDumbbell, FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { restoreUser } = useAuth();
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
        : { name: data.name, email: data.email, password: data.password};

      const response = await axios.post(`https://gym-project-server.onrender.com/auth/${endpoint}`, payload, {
        withCredentials: true,
      });
      setAuthenticated(true); // Set authenticated state in CartContext

      const { token } = response.data.user;
      // console.log("res", response.data)
      localStorage.setItem("token",token);
      // console.log(token);

      await login({ token, user: response.data.user });

      toast.success(`${isLogin ? "Login" : "Signup"} successful!`);
      reset();

      const loggedInUser = response.data.user;

      if (loggedInUser.email === "admin@gmail.com") {
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
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md transform translate-y-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
        <div className="text-center">
          <FaDumbbell className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create new account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-blue-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-blue-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                type={showPassword ? "text" : "password"}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
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

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleForm}
            className="text-sm text-blue-500 hover:text-red-600 transition-colors duration-300"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
