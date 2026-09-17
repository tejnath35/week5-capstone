import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_URL } from '../utils/api';
import ActivityPanel from './ActivityPanel';
import { useAuth } from '../Rstore/authStore';

function AuthorProfile() {

  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const [author, setAuthor] = useState({ firstName: "", lastName: "", email: "", profileImageUrl: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ firstName: "", lastName: "", profileImageUrl: "" });

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/author-api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });
        setAuthor(res.data.payload);
        setProfileDraft({
          firstName: res.data.payload.firstName || "",
          lastName: res.data.payload.lastName || "",
          profileImageUrl: res.data.payload.profileImageUrl || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchAuthorProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/author-api/profile`, profileDraft, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setAuthor(res.data.payload);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">MyBlog / Creator space</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Welcome to your dashboard</h1>

      {/* Author Profile Section */}
      <div className="mb-5 mt-8 flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:flex-row">
        
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-300 bg-cyan-100 text-3xl font-bold text-cyan-800 shadow-sm group">
            {author.profileImageUrl ? (
              <img src={author.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{author.firstName?.charAt(0) || "A"}</span>
            )}
            
          </div>
        </div>

        {/* User Details */}
        <div className="min-w-0 flex-1 w-full">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Author Name</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {author.firstName} {author.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Email ID</p>
              <p className="mt-1 break-all text-base font-semibold text-white">{author.email}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Published</p>
              <p className="mt-1 whitespace-nowrap text-xl font-semibold text-cyan-300">{author.articleCount || 0} articles</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="rounded-lg border border-cyan-300 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-300 hover:text-slate-950">
              {isEditingProfile ? "Cancel" : "Edit profile"}
            </button>
            <button type="button" onClick={() => navigate("/write-article")} className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
              Write article
            </button>
            <button type="button" onClick={handleLogout} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500 hover:text-white">
              Logout
            </button>
          </div>

          {isEditingProfile && (
            <form onSubmit={handleUpdateProfile} className="mt-6 grid gap-3 sm:grid-cols-2">
              <input type="text" placeholder="First name" value={profileDraft.firstName} onChange={(e) => setProfileDraft({ ...profileDraft, firstName: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300" required />
              <input type="text" placeholder="Last name" value={profileDraft.lastName} onChange={(e) => setProfileDraft({ ...profileDraft, lastName: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300" />
              <input type="url" placeholder="Profile image URL" value={profileDraft.profileImageUrl} onChange={(e) => setProfileDraft({ ...profileDraft, profileImageUrl: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:col-span-2" />
              <button type="submit" className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 sm:col-span-2">Save profile</button>
            </form>
          )}
        </div>
      </div>

      <ActivityPanel />

      </div>
    </div>
  );
}

export default AuthorProfile;