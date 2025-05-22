import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async ({ token, user }) => {
    try {
      setUser(user);
      // localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("key");
      toast.success("Logged out");
    }
    catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };
  const restoreUser = async () => {
    try {
      const response = await axios.post("http://localhost:8000/auth/getUser", {}, {
        withCredentials: true
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
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

  const value = {
    user,
    login,
    logout,
    isAdmin,
    loading,
    restoreUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
