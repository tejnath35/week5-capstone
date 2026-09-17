import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Rstore/authStore";
import { API_URL } from '../utils/api';

function WriteArticle() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitArticle = async (articleObj) => {
    setLoading(true);

    // add authorId
    articleObj.author = currentUser._id;

    try {
      await axios.post(`${API_URL}/author-api/articles`,
        articleObj,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        }
      );

      toast.success("Article published successfully!");

      reset();

      navigate("/articles");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full flex-1 bg-slate-950 px-4 py-8 sm:px-8 lg:px-16">

      <div className="mx-auto min-h-[calc(100vh-8rem)] w-full border border-cyan-200 bg-white px-6 py-8 shadow-xl sm:px-12 lg:px-20">

        <button
          type="button"
          onClick={() => navigate("/articles")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>

        <h2 className="mb-10 text-center font-serif text-4xl font-bold text-slate-950">
          New article
        </h2>

        <form onSubmit={handleSubmit(submitArticle)}>

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>

            <input
              type="text"
              placeholder="Enter article title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
              className="w-full border-0 border-b border-slate-300 bg-transparent px-0 py-3 text-3xl font-serif outline-none focus:border-cyan-600"
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>

            <select
              {...register("category", {
                required: "Category is required",
              })}
              className="w-full border border-slate-300 bg-white px-4 py-3 outline-none focus:border-cyan-600"
            >
              <option value="">Select category</option>
              <option value="technology">Technology</option>
              <option value="programming">Programming</option>
              <option value="ai">AI</option>
              <option value="web-development">Web Development</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="productivity">Productivity</option>
              <option value="science">Science</option>
              <option value="travel">Travel</option>
              <option value="culture">Culture</option>
              <option value="entertainment">Entertainment</option>
            </select>

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>

            <textarea
              rows="18"
              placeholder="Write your article content..."
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 50,
                  message: "Content must be at least 50 characters",
                },
              })}
              className="w-full resize-none border-0 bg-transparent px-0 py-3 font-serif text-lg leading-8 text-slate-800 outline-none focus:ring-0"
            />

            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-600 py-2.5 text-white font-bold transition hover:bg-cyan-700"
          >
            {loading ? "Publishing..." : "Publish Article"}
          </button>

          {loading && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Publishing article...
            </p>
          )}
        </form>

      </div>
    </main>
  );
}

export default WriteArticle;