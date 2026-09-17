import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { useAuth } from "../Rstore/authStore";

function ActivityList({ id, title, actionLabel, articles, onOpen, isOpen, onToggle }) {
  return (
    <section className="self-start rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        id={`${id}-toggle`}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
      >
        <span>
          <span className="block text-xl font-bold text-slate-950">{title}</span>
          <span className="mt-1 block text-sm text-slate-500">{articles.length} article{articles.length === 1 ? "" : "s"}</span>
        </span>
        <span className={`h-3 w-3 rotate-45 border-r-2 border-t-2 border-cyan-700 transition-transform ${isOpen ? "-rotate-45" : ""}`} aria-hidden="true" />
      </button>
      {isOpen && (
        articles.length === 0 ? (
          <p className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">Nothing here yet.</p>
        ) : (
          <div className="max-h-96 space-y-3 overflow-y-auto border-t border-slate-100 p-5">
            {articles.map((article) => (
              <button key={article._id} onClick={() => onOpen(article)} className="block w-full cursor-pointer rounded-xl border border-slate-100 p-3 text-left transition hover:border-cyan-200 hover:bg-cyan-50">
                <p className="font-semibold text-slate-900">{actionLabel}: {article.title}</p>
                <p className="mt-1 text-xs text-slate-500">By {article.author?.firstName} {article.author?.lastName}</p>
              </button>
            ))}
          </div>
        )
      )}
    </section>
  );
}

function ActivityPanel() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);
  const [activity, setActivity] = useState({ likedArticles: [], commentedArticles: [], authoredArticles: [] });
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const getActivity = async () => {
      try {
        const response = await axios.get(`${API_URL}/common-api/activity`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setActivity(response.data.payload);
      } catch (error) {
        console.error("Failed to load activity", error);
      }
    };
    getActivity();
  }, []);

  const openArticle = (article) => navigate(`/article/${article._id}`, { state: article });

  return (
    <section className="my-8 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5">
      <h2 className="text-2xl font-bold text-slate-950">Your activities</h2>
      <div className="mt-4 grid items-start gap-5 md:grid-cols-2">
        {user?.role === "AUTHOR" && (
          <ActivityList id="your-articles" title="Your articles" actionLabel="Published" articles={activity.authoredArticles} onOpen={openArticle} isOpen={openSection === "your-articles"} onToggle={() => setOpenSection(openSection === "your-articles" ? null : "your-articles")} />
        )}
        <ActivityList id="liked-articles" title="Liked articles" actionLabel="Liked" articles={activity.likedArticles} onOpen={openArticle} isOpen={openSection === "liked-articles"} onToggle={() => setOpenSection(openSection === "liked-articles" ? null : "liked-articles")} />
        <ActivityList id="commented-articles" title="Commented articles" actionLabel="Commented" articles={activity.commentedArticles} onOpen={openArticle} isOpen={openSection === "commented-articles"} onToggle={() => setOpenSection(openSection === "commented-articles" ? null : "commented-articles")} />
      </div>
    </section>
  );
}

export default ActivityPanel;
