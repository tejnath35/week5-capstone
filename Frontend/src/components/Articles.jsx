import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { useAuth } from "../Rstore/authStore";

function Articles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("article");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/common-api/articles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setArticles(response.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load articles right now.");
      } finally {
        setLoading(false);
      }
    };
    getArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return articles;
    return articles.filter((article) => {
      if (searchBy === "author") {
        const authorName = `${article.author?.firstName || ""} ${article.author?.lastName || ""}`;
        return authorName.toLowerCase().includes(query);
      }
      return `${article.title} ${article.content} ${article.category}`.toLowerCase().includes(query);
    });
  }, [articles, searchBy, searchTerm]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <main className="min-h-screen w-full flex-1 bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">MyBlog / Library</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">All articles</h1>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <select value={searchBy} onChange={(event) => setSearchBy(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-cyan-500">
              <option value="article">Article</option>
              <option value="author">Author name</option>
            </select>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={searchBy === "author" ? "Search by author name" : "Search articles by title or topic"} className="min-w-0 grow rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-500" />
          </div>
          {user?.role === "AUTHOR" && (
            <button onClick={() => navigate("/write-article")} className="mt-4 rounded-full bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">
              Write article
            </button>
          )}
        </div>

        {loading && <p className="py-12 text-center text-slate-500">Loading articles...</p>}
        {error && <p className="py-12 text-center text-red-600">{error}</p>}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="flex min-h-[45vh] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-lg text-slate-500">No articles match your search.</p>
          </div>
        )}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article key={article._id} className="flex min-h-72 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">{article.category}</span>
                  <span className="text-xs text-slate-400">{formatDate(article.createdAt)}</span>
                </div>
                <h2 className="mt-5 line-clamp-2 text-xl font-bold leading-snug text-slate-900">{article.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.content}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <p className="truncate text-sm font-bold text-cyan-700">By {article.author?.firstName} {article.author?.lastName}</p>
                  <button onClick={() => navigate(`/article/${article._id}`, { state: article })} className="shrink-0 text-sm font-bold text-slate-900 hover:text-cyan-700">Read article</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Articles;
