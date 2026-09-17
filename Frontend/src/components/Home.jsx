import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Rstore/authStore";
import { API_URL } from "../utils/api";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(isAuthenticated);
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
    if (!isAuthenticated) {
      setArticles([]);
      setLoading(false);
      return;
    }

    const getArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/common-api/articles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setArticles(response.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load articles right now.");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [isAuthenticated]);

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

      {isAuthenticated ? (
        <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700">Latest writing</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">Explore articles</h2>
          </div>
          <button onClick={() => navigate("/articles")} className="rounded-full border border-cyan-600 px-5 py-3 text-sm font-bold text-cyan-700 transition hover:bg-cyan-600 hover:text-white">Browse all articles</button>
        </div>

        {loading && <p className="py-12 text-center text-slate-500">Loading articles...</p>}
        {error && <p className="py-12 text-center text-red-600">{error}</p>}
        {!loading && !error && articles.length === 0 && <p className="py-12 text-center text-slate-500">No articles available.</p>}

        {!loading && !error && articles.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
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
      ) : (
        <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
          <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">Members only</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Log in to read the articles</h2>
              <p className="mt-4 leading-7 text-slate-600">Sign in to explore the article library, search by topic or author, and join the conversation.</p>
              <button onClick={() => navigate("/login")} className="mt-7 rounded-full bg-cyan-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">Log in to continue</button>
            </div>

            <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-cyan-100" aria-hidden="true"></div>
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">Example article</span>
                  <span className="text-sm text-slate-400" aria-label="Article locked">Locked</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold leading-snug text-slate-950">Building a writing habit that lasts</h3>
                <p className="mt-3 text-sm font-bold text-cyan-700">By MyBlog Editorial</p>
                <p className="mt-4 leading-7 text-slate-600">Small, consistent writing sessions can turn scattered ideas into work you are proud to share. Discover a simple rhythm for making room to think.</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Preview only</span>
                  <button onClick={() => navigate("/login")} className="text-sm font-bold text-cyan-700 transition hover:text-cyan-900">Unlock with login</button>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;