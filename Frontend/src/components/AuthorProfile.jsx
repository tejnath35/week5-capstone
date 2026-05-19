import { NavLink, Outlet } from "react-router";
import { useEffect, useState } from "react";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "https://week5-capstone.onrender.com");

function AuthorProfile() {
  const [author, setAuthor] = useState({ firstName: "", lastName: "", email: "", profileImageUrl: "" });
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [picUrlInput, setPicUrlInput] = useState("");

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/author-api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });
        setAuthor(res.data.payload);
        setPicUrlInput(res.data.payload.profileImageUrl || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchAuthorProfile();
  }, []);

  const handleUpdateProfilePic = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/author-api/profile-image`, { profileImageUrl: picUrlInput }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setAuthor(res.data.payload);
      setIsEditingPic(false);
    } catch (err) {
      console.error("Failed to update profile picture", err);
    }
  };

  return (
    <div className="min-h-screen w-full p-5 m-auto ">
      <div>
        <h1 className="text-4xl text-blue-400 font-bold">Welcome to Dashboard</h1>
      </div>

      {/* Author Profile Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-5 mt-5 flex flex-col md:flex-row items-center gap-8">
        
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-3xl overflow-hidden border-2 border-blue-200 shadow-sm relative group">
            {author.profileImageUrl ? (
              <img src={author.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{author.firstName?.charAt(0) || "A"}</span>
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Author Name</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {author.firstName} {author.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm uppercase tracking-wide">Email ID</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{author.email}</p>
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
                className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

      {/* Author Navigation */}
      <div className="flex gap-6 mb-1 mt-0 font-bold ">

        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive
              ? "text-violet-600 font-semibold border-b-2 border-violet-600 pb-1"
              : "text-gray-600 hover:text-violet-600 pb-1"
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive
              ? "text-violet-600 font-semibold border-b-2 border-violet-600 pb-1"
              : "text-gray-600 hover:text-violet-600 pb-1"
          }
        >
          Write Article
        </NavLink>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-400 mb-5"></div>

      {/* Nested route content */}
      <Outlet />

    </div>
  );
}

export default AuthorProfile;