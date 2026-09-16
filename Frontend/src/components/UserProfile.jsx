import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { useEffect, useState } from "react";
import { API_URL } from '../utils/api';

function UserProfile() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "", profileImageUrl: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ firstName: "", lastName: "", profileImageUrl: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user-api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });
        setUser(res.data.payload);
        setProfileDraft({
          firstName: res.data.payload.firstName || "",
          lastName: res.data.payload.lastName || "",
          profileImageUrl: res.data.payload.profileImageUrl || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/user-api/profile`, profileDraft, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });
      setUser(res.data.payload);
      setIsEditingProfile(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
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

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-slate-500 mt-20">
        Loading articles...
      </p>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      
      <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">MyBlog / Reader space</p>
      <h1 className="mt-2 mb-8 text-4xl font-bold tracking-tight text-slate-950">Welcome to your dashboard</h1>

      {/* User Profile Section */}
      <div className="mb-8 flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:flex-row">
        
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-300 bg-cyan-100 text-3xl font-bold text-cyan-800 shadow-sm group">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{user.firstName?.charAt(0) || "U"}</span>
            )}
            
          </div>
        </div>

        {/* User Details */}
        <div className="min-w-0 flex-1 w-full">
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">User Name</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Email ID</p>
              <p className="mt-1 break-all text-base font-semibold text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Account</p>
              <p className="mt-1 text-xl font-semibold text-cyan-300">Reader</p>
            </div>
          </div>

          <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="mt-5 rounded-lg border border-cyan-300 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-300 hover:text-slate-950">
            {isEditingProfile ? "Cancel" : "Edit profile"}
          </button>
          
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

      {error && (
        <p className="text-red-500 text-center mb-6">{error}</p>
      )}

      {/* Articles Title */}
      <h2 className="mb-6 text-2xl font-bold text-slate-950">Articles for you</h2>

      {/* No articles */}
      {articles.length === 0 && (
        <p className="text-center text-slate-500 text-lg">
          No articles available.
        </p>
      )}

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {articles.map((articleObj) => (
          <div
            key={articleObj._id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"
          >

            {/* Title */}
            <p className="mb-2 text-base font-bold text-slate-900">
              {articleObj.title}
            </p>

            <p className="text-sm font-bold text-cyan-700 mb-2">
              By {`${articleObj.author?.firstName || ""} ${articleObj.author?.lastName || ""}`.trim() || "Unknown author"}
            </p>

            {/* Content preview */}
            <p className="mb-4 text-sm leading-6 text-slate-600 wrap-break-word">
              {articleObj.content.slice(0, 80)}...
            </p>

            {/* Timestamp */}
            <p className="mb-4 text-xs text-slate-400">
              {formatDateIST(articleObj.createdAt)}
            </p>

            {/* Button */}
            <button
              className="mt-auto text-left text-sm font-bold text-slate-900 transition hover:text-cyan-700"
              onClick={() => navigateToArticleByID(articleObj)}
            >
              Read Article →
            </button>

          </div>
        ))}

      </div>
      </div>
    </div>
  );
}

export default UserProfile;