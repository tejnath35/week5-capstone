import { useAuth } from "../Rstore/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

function UserProfile() {
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/user-api/profile",
          { withCredentials: true }
        );
        setUser(res.data.payload);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:4000/user-api/articles",
          { withCredentials: true }
        );

        // ✅ FILTER ONLY ACTIVE ARTICLES
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
      {/* User Profile Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
        <div className="grid md:grid-cols-2 gap-6">
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {articles.map((articleObj) => (
          <div
            key={articleObj._id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col"
          >

            {/* Title */}
            <p className="text-lg font-semibold text-gray-800 mb-2">
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