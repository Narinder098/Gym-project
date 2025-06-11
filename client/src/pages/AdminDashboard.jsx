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

    // Delay hiding sidebar for smooth transition
    if (window.innerWidth < 768) {
      setTimeout(() => {
        setIsSidebarOpen(false);
      }, 300); // Wait for navigation to complete
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
    <div className="min-h-screen bg-gray-100 font-sans">
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 250 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`transition-all duration-300 bg-white border-r border-gray-200 shadow-md min-h-screen md:block ${isSidebarOpen ? "block" : "hidden"
            } fixed md:relative z-30`}
        >

          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Admin</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
              aria-label="Toggle sidebar"
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
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
       <main className="flex-1 md:ml-8 p-4 md:p-6 transition-all duration-300">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="fixed top-20 left-4 z-40 p-2 bg-blue-600 text-white rounded-md shadow md:hidden"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>

          {/* Animated Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow p-5 md:p-8"
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
