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

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:4000/user-api/articles",
          { withCredentials: true }
        );

        setArticles(res.data.payload);
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
            <p className="text-gray-600 text-sm mb-4">
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