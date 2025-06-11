import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

// Constants
const STATUS_COLORS = {
  Active: { bg: "bg-green-100", text: "text-green-600" },
  Inactive: { bg: "bg-red-100", text: "text-red-600" },
  Suspended: { bg: "bg-yellow-100", text: "text-yellow-600" },
};

const MEMBERSHIP_COLORS = {
  Basic: { bg: "bg-gray-100", text: "text-gray-600" },
  Premium: { bg: "bg-blue-100", text: "text-blue-600" },
  Pro: { bg: "bg-purple-100", text: "text-purple-600" },
};

const STATUS_OPTIONS = ["Active", "Inactive", "Suspended"];
const MEMBERSHIP_OPTIONS = ["Basic", "Premium", "Pro"];

// Reusable Components
const StatusSelect = memo(({ status, onChange, userId }) => {
  const { bg, text } = STATUS_COLORS[status] || STATUS_COLORS.Inactive;
  return (
    <select
      value={status}
      onChange={(e) => onChange(userId, e.target.value)}
      className={`px-3 py-1 rounded-full text-sm font-medium ${bg} ${text} focus:outline-none focus:ring-2 focus:ring-blue-300`}
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
});

StatusSelect.propTypes = {
  status: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

const MembershipSelect = memo(({ membershipType, onChange, userId }) => {
  const { bg, text } = MEMBERSHIP_COLORS[membershipType] || MEMBERSHIP_COLORS.Basic;
  return (
    <select
      value={membershipType}
      onChange={(e) => onChange(userId, e.target.value)}
      className={`px-3 py-1 rounded-full text-sm font-medium ${bg} ${text} focus:outline-none focus:ring-2 focus:ring-blue-300`}
    >
      {MEMBERSHIP_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
});

MembershipSelect.propTypes = {
  membershipType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

// Main Component
const UserManagement = () => {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [retryLoading, setRetryLoading] = useState(false);
  const navigate = useNavigate();

  // Auth Check
  useEffect(() => {
    console.log("Auth state:", { user, authLoading });
    if (!authLoading && !user) {
      navigate("/login");
      toast.error("Authentication required");
    }
  }, [user, authLoading, navigate]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching users from /auth/users");
      const res = await axios.get("http://localhost:8000/auth/users", {
        withCredentials: true,
      });
      console.log("Response:", res.data);
      let fetchedUsers = [];
      if (res.data.success && Array.isArray(res.data.users)) {
        fetchedUsers = res.data.users;
      } else if (Array.isArray(res.data)) {
        fetchedUsers = res.data;
        console.warn("Received array response; expected { success: true, users: [...] }");
      } else {
        throw new Error(res.data.message || "Invalid response format");
      }
      const uniqueUsers = Array.from(new Map(fetchedUsers.map((u) => [u._id, u])).values());
      setUsers(uniqueUsers);
    } catch (err) {
      console.error("Fetch users error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const message = err.response?.data?.message || err.message || "Failed to fetch users";
      setError(message);
      toast.error(message);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
      setRetryLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  // Handlers
  const handleUpdateMembership = async (userId, newType) => {
    try {
      if (!isAdmin()) {
        toast.error("Admin access required");
        return;
      }
      const response = await axios.patch(
        `http://localhost:8000/auth/updateMembership/${userId}`,
        { membershipType: newType },
        { withCredentials: true }
      );
      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, membershipType: newType } : u))
        );
        toast.success("Membership updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update membership");
      }
    } catch (err) {
      console.error("Update membership error:", err);
      const message = err.response?.data?.message || "Failed to update membership";
      toast.error(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      if (!isAdmin()) {
        toast.error("Admin access required");
        return;
      }
      const response = await axios.patch(
        `http://localhost:8000/auth/updateStatus/${userId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
        toast.success("Status updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      const message = err.response?.data?.message || "Failed to update status";
      toast.error(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      if (!isAdmin()) {
        toast.error("Admin access required");
        return;
      }
      const response = await axios.delete(`http://localhost:8000/auth/deleteUser/${userId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      const message = err.response?.data?.message || "Failed to delete user";
      toast.error(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEditUser = async (userId, updatedData) => {
    try {
      if (!isAdmin()) {
        toast.error("Admin access required");
        return;
      }
      const response = await axios.patch(
        `http://localhost:8000/auth/updateUser/${userId}`,
        updatedData,
        { withCredentials: true }
      );
      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...updatedData } : u))
        );
        toast.success("User updated successfully");
        setEditUser(null);
      } else {
        toast.error(response.data.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Update user error:", err);
      const message = err.response?.data?.message || "Failed to update user";
      toast.error(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
      }
    }
  };

  // Search Filter
  const filteredUsers = useMemo(
    () =>
      users
        .filter(
          (u) =>
            (!u.role || u.role.toLowerCase() !== "admin") &&
            u.email?.toLowerCase() !== "admin@gmail.com"
        )
        .filter(
          (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        ),
    [users, search]
  );

  // Format Date
  const formatDate = useMemo(
    () => (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    []
  );

  // Loading and Error States
  if (authLoading || loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Users Management</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setRetryLoading(true);
            fetchUsers();
          }}
          disabled={retryLoading}
          className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${retryLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {retryLoading ? "Retrying..." : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0z"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Email", "Membership", "Status", "Join Date", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAdmin() ? (
                        <MembershipSelect
                          membershipType={user.membershipType || "Basic"}
                          onChange={handleUpdateMembership}
                          userId={user._id}
                        />
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${MEMBERSHIP_COLORS[user.membershipType || "Basic"].bg
                            } ${MEMBERSHIP_COLORS[user.membershipType || "Basic"].text
                            }`}
                        >
                          {user.membershipType || "Basic"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAdmin() ? (
                        <StatusSelect
                          status={user.status || "Inactive"}
                          onChange={handleUpdateStatus}
                          userId={user._id}
                        />
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[user.status || "Active"].bg
                            } ${STATUS_COLORS[user.status || "Active"].text}`}
                        >
                          {user.status || "Active"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isAdmin() && (
                        <div className="space-x-2">
                          <button
                            onClick={() => setEditUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit user"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete user"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-6 text-gray-600">No users found.</div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updatedData = {
                    name: formData.get("name"),
                    email: formData.get("email"),
                  };
                  handleEditUser(editUser._id, updatedData);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editUser.name}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editUser.email}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;