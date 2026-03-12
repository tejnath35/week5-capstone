import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../Rstore/authStore";

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
        const res = await axios.get(
          `http://localhost:4000/author-api/articles/${user._id}`,
          { withCredentials: true }
        );

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

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-gray-600 mt-10">
        Loading articles...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        You haven't published any articles yet.
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {articles.map((article) => (
          <div
            key={article._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col h-full"
          >
            <div className="flex flex-col gap-2">

              {/* Category */}
              <p className="text-xs text-violet-600 font-semibold uppercase">
                {article.category}
              </p>

              {/* Title */}
              <p className="text-lg font-semibold text-gray-800 wrap-break-words line-clamp-2">
                {article.title}
              </p>

              {/* Content Preview */}
              <p className="text-sm text-gray-600 wrap-break-words line-clamp-3">
                {article.content}
              </p>

              {/* Date */}
              <p className="text-xs text-gray-400">
                {formatDate(article.createdAt)}
              </p>

            </div>

            {/* Button */}
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