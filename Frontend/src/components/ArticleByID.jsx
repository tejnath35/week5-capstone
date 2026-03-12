import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Rstore/authStore";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:4000/user-api/article/${id}`,
          { withCredentials: true }
        );

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete article
const deleteArticle = async () => {
  try {
    await axios.patch(
      `http://localhost:4000/author-api/articles/${id}/status`,
      { isArticleActive: false },
      { withCredentials: true }
    );

    navigate("/author-profile");
  } catch (err) {
    setError(err.response?.data?.error);
  }
};

  const editArticle = (articleObj) => {
    navigate(`/edit-article/${articleObj._id}`, { state: articleObj });
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-gray-600 mt-20">
        Loading article...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-20">{error}</p>;
  }

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8 border-b pb-6">

        <span className="text-sm font-semibold text-violet-600 uppercase">
          {article.category}
        </span>

        <h1 className="text-3xl font-bold text-gray-900 mt-2 uppercase">
          {article.title}
        </h1>

        <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
          <div>✍️ {article.author?.firstName || "Author"}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-10">
        {article.content}
      </div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className="flex gap-4 mb-6">

          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            onClick={() => editArticle(article)}
          >
            Edit
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={deleteArticle}
          >
            Delete
          </button>

        </div>
      )}

      {/* Footer */}
      <div className="text-sm text-gray-400 border-t pt-4">
        Last updated: {formatDate(article.updatedAt)}
      </div>

    </div>
  );
}

export default ArticleByID;