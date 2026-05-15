import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router";
import { useAuth } from "../Rstore/authStore";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "https://week5-capstone.onrender.com");

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${API_URL}/author-api/articles/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });

        setArticles(res.data.payload);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);


  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  // format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  // loading
  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-gray-600 mt-10">
        Loading articles...
      </p>
    );
  }

  // error
  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  // empty
  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        You haven't published any articles yet.
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">

        {articles.map((article) => (
          <div
            key={article._id}
            className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col h-full w-full max-w-sm
              ${!article.isArticleActive ? "opacity-80 border-red-200" : ""}
            `}
          >
            <div className="flex flex-col gap-2">

              {/* Top row */}
              <div className="flex justify-between items-center">
                <p className="text-xs text-violet-600 font-semibold uppercase">
                  {article.category}
                </p>

                {!article.isArticleActive && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    Deleted
                  </span>
                )}
              </div>

              {/* Title */}
              <p className="text-base font-semibold text-gray-800 wrap-break-word line-clamp-2">
                {article.title}
              </p>

              {/* Content preview */}
              <p className="text-sm text-gray-600 wrap-break-word line-clamp-3">
                {article.content}
              </p>

              {/* Date */}
              <p className="text-xs text-gray-400">
                {formatDate(article.createdAt)}
              </p>
            </div>

            {/* ✅ Single clean button */}
            <button
              className="mt-auto pt-4 text-blue-600 text-sm font-medium hover:text-blue-800"
              onClick={() => openArticle(article)}
            >
              Read Article →
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default AuthorArticles;