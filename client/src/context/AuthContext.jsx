import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const { syncCartOnLogin } = useCart();

  const login = async ({ token, user }) => {
    try {
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");
      // syncCartOnLogin();
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        " https://gym-project-server.onrender.com/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  const restoreUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://gym-project-server.onrender.com/auth/getUser",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Token:", token);
      console.log("res", response.data?.user);

      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("restoreUser failed", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    restoreUser();
  }, []);

  const isAdmin = () => {
    return user?.role === "admin";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        loading,
        restoreUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
