import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../Rstore/authStore";

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
      await axios.post(
        "http://localhost:4000/author-api/articles",
        articleObj,
        { withCredentials: true }
      );

      toast.success("Article published successfully!");

      reset();

      navigate("/author-profile/articles");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-150 flex items-center justify-center m-auto pt-10">

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-2xl">

        <h2 className="text-2xl font-bold text-violet-700 mb-6 text-center">
          Write New Article
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">Select category</option>
              <option value="technology">Technology</option>
              <option value="programming">Programming</option>
              <option value="ai">AI</option>
              <option value="web-development">Web Development</option>
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
              rows="8"
              placeholder="Write your article content..."
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 50,
                  message: "Content must be at least 50 characters",
                },
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
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
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-semibold hover:bg-violet-700 transition"
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
    </div>
  );
}

export default WriteArticle;