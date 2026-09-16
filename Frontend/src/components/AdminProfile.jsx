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
      <p className="text-center text-lg font-semibold text-slate-500 mt-20">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">MyBlog / Control room</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Admin dashboard</h1>

      {error && (
        <p className="mb-6 text-center text-red-600">{error}</p>
      )}

      {/* Logout */}
      <div className="mb-8 flex justify-end">
        <button
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-700"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-2xl font-bold text-slate-950">Manage users</h2>

      <p className="text-slate-600">Admin functionalities can be added here, such as managing users.</p>

      {/* Example: Delete user by ID */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="mb-4 text-lg font-bold text-slate-950">Delete User</h3>
        <input
          type="text"
          placeholder="Enter User ID"
          className="mr-4 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          id="userIdInput"
        />
        <button
          className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
          onClick={() => {
            const userId = document.getElementById('userIdInput').value;
            if (userId) onDeleteUser(userId);
          }}
        >
          Delete User
        </button>
      </div>
      </section>

      </div>
    </div>
  );
}

export default AdminProfile;