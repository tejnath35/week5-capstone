import { useAuth } from "../Rstore/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "https://week5-capstone.onrender.com");

function UserProfile() {
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "", profileImageUrl: "" });
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [picUrlInput, setPicUrlInput] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user-api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });
        setUser(res.data.payload);
        setPicUrlInput(res.data.payload.profileImageUrl || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfilePic = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/user-api/profile-image`, { profileImageUrl: picUrlInput }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setUser(res.data.payload);
      setIsEditingPic(false);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile picture");
    }
  };

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/user-api/articles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });

        // FILTER ONLY ACTIVE ARTICLES
        const activeArticles = res.data.payload.filter(
          (article) => article.isArticleActive
        );

        setArticles(activeArticles);

      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  // convert UTC → IST
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-gray-600 mt-20">
        Loading articles...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to Dashboard</h1>

      {/* User Profile Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
        
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-3xl overflow-hidden border-2 border-blue-200 shadow-sm relative group">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{user.firstName?.charAt(0) || "U"}</span>
            )}
            
            {/* Hover overlay for changing picture */}
            <div 
              onClick={() => setIsEditingPic(!isEditingPic)}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="text-white text-xs font-semibold">Edit</span>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 w-full">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-gray-600 text-sm uppercase tracking-wide">User Name</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Email ID</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{user.email}</p>
            </div>
          </div>
          
          {/* Profile Picture Edit Input */}
          {isEditingPic && (
            <form onSubmit={handleUpdateProfilePic} className="mt-6 flex gap-2 w-full max-w-md">
              <input 
                type="url" 
                placeholder="Paste image URL here..."
                value={picUrlInput}
                onChange={(e) => setPicUrlInput(e.target.value)}
                className="grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Save
              </button>
            </form>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-6">{error}</p>
      )}

      {/* Articles Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Articles</h2>

      {/* No articles */}
      {articles.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No articles available.
        </p>
      )}

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {articles.map((articleObj) => (
          <div
            key={articleObj._id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col"
          >

            {/* Title */}
            <p className="text-base font-semibold text-gray-800 mb-2">
              {articleObj.title}
            </p>

            {/* Content preview */}
            <p className="text-gray-600 text-sm mb-4 wrap-break-word">
              {articleObj.content.slice(0, 80)}...
            </p>

            {/* Timestamp */}
            <p className="text-xs text-gray-400 mb-4">
              {formatDateIST(articleObj.createdAt)}
            </p>

            {/* Button */}
            <button
              className="mt-auto text-blue-600 text-sm font-medium hover:text-blue-800"
              onClick={() => navigateToArticleByID(articleObj)}
            >
              Read Article →
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default UserProfile;