import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Rstore/authStore";
import { API_URL } from "../utils/api";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("article");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roleRoutes = {
    USER: "/user-profile",
    AUTHOR: "/author-profile",
    ADMIN: "/admin-profile",
  };

  const handleGetStarted = () => {
    if (!currentUser?.role) return;

    navigate(roleRoutes[currentUser.role] || "/");
  };

  useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/common-api/articles`);
        setArticles(response.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load articles right now.");
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

      return `${article.title} ${article.content} ${article.category}`
        .toLowerCase()
        .includes(query);
    });
  }, [articles, searchBy, searchTerm]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const getAuthorName = (article) => {
    const name = `${article.author?.firstName || ""} ${article.author?.lastName || ""}`.trim();
    return name || "Unknown author";
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-16 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">MyBlog / Explore</p>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Ideas worth your next few minutes.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Find thoughtful articles from a growing community of writers and follow the voices that keep you curious.</p>
            </div>
            <button onClick={isAuthenticated ? handleGetStarted : () => navigate("/login")} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
              {isAuthenticated ? "Go to dashboard" : "Join the community"}
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700">Latest writing</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">Explore articles</h2>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:max-w-xl">
            <label className="sr-only" htmlFor="search-by">Search by</label>
            <select id="search-by" value={searchBy} onChange={(event) => setSearchBy(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">
              <option value="article">Article</option>
              <option value="author">Author name</option>
            </select>
            <label className="sr-only" htmlFor="article-search">Search articles</label>
            <input id="article-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={searchBy === "author" ? "Search by author name" : "Search articles by title or topic"} className="min-w-0 grow rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
          </div>
        </div>

        {loading && <p className="py-12 text-center text-slate-500">Loading articles...</p>}
        {error && <p className="py-12 text-center text-red-600">{error}</p>}
        {!loading && !error && filteredArticles.length === 0 && <p className="py-12 text-center text-slate-500">No articles match your search.</p>}

        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article key={article._id} className="flex min-h-72 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">{article.category}</span>
                  <span className="text-xs text-slate-400">{formatDate(article.createdAt)}</span>
                </div>
                <h3 className="mt-5 line-clamp-2 text-xl font-bold leading-snug text-slate-900">{article.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.content}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Written by</p>
                    <p className="truncate text-sm font-bold text-cyan-700">{getAuthorName(article)}</p>
                  </div>
                  <button onClick={() => navigate(`/article/${article._id}`, { state: article })} className="shrink-0 text-sm font-bold text-slate-900 transition hover:text-cyan-700">Read article</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;