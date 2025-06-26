import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaUsers, FaDumbbell, FaBox, FaCrown, FaShoppingBag, FaTachometerAlt, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../components/AdminNavbar";
import UsersManagement from "../components/admin/UsersManagement";
import ExercisesManagement from "../components/admin/ExercisesManagement";
import ProductsManagement from "../components/admin/ProductsManagement";
import SubscriptionsManagement from "../components/admin/SubscriptionsManagement";
import OrdersManagement from "../components/admin/OrdersManagement";
import AdminOverview from "../components/admin/AdminOverview";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const path = location.pathname.replace("/admin/", "").replace("/management", "") || "overview";
    setActiveTab(path);
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab === "overview" ? "" : tab}`);
    if (window.innerWidth < 768) {
      setTimeout(() => setIsSidebarOpen(false), 300);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: <FaTachometerAlt /> },
    { id: "management", label: "Users", icon: <FaUsers /> },
    { id: "exercises", label: "Exercises", icon: <FaDumbbell /> },
    { id: "products", label: "Products", icon: <FaBox /> },
    { id: "subscriptions", label: "Subscriptions", icon: <FaCrown /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag /> },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <AdminNavbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : -260 }}
          transition={{ type: "tween" }}
          className={`bg-white w-60 border-r shadow-md z-40 md:relative md:translate-x-0 md:block flex-shrink-0`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Admin</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 md:hidden"
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        {/* Content Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-100">
          {/* Mobile Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="fixed top-20 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow md:hidden"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow p-4 sm:p-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Routes>
                  <Route path="/" element={<AdminOverview />} />
                  <Route path="/management" element={<UsersManagement />} />
                  <Route path="/exercises" element={<ExercisesManagement />} />
                  <Route path="/products" element={<ProductsManagement />} />
                  <Route path="/subscriptions" element={<SubscriptionsManagement />} />
                  <Route path="/orders" element={<OrdersManagement />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
