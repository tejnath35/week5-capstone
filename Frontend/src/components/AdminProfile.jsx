import { useAuth } from "../Rstore/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { useEffect, useState } from "react";
import { API_URL } from '../utils/api';

function AdminProfile() {

  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
      
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const onDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin-api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      toast.success("User deleted successfully");
      // Refresh users list if implemented
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-gray-600 mt-20">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {error && (
        <p className="text-red-500 text-center mb-6">{error}</p>
      )}

      {/* Logout */}
      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <p>Admin functionalities can be added here, such as managing users.</p>

      {/* Example: Delete user by ID */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Delete User</h3>
        <input
          type="text"
          placeholder="Enter User ID"
          className="border border-gray-300 rounded-lg px-4 py-2 mr-4"
          id="userIdInput"
        />
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          onClick={() => {
            const userId = document.getElementById('userIdInput').value;
            if (userId) onDeleteUser(userId);
          }}
        >
          Delete User
        </button>
      </div>

    </div>
  );
}

export default AdminProfile;