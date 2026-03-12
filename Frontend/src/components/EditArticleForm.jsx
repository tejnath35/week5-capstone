import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const article = location.state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Prefill form
  useEffect(() => {
    if (!article) {
      navigate("/author-profile");
      return;
    }

    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);
  }, [article, setValue, navigate]);

  // Update article
  const updateArticle = async (data) => {
    try {
      const updatedData = {
        articleId: id,
        title: data.title,
        category: data.category,
        content: data.content,
        author: article.author,
      };

      await axios.put(
        "http://localhost:4000/author-api/articles",
        updatedData,
        { withCredentials: true }
      );

      toast.success("Article updated successfully");

      navigate("/author-profile");

    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen m-auto w-full bg-amber-100 flex items-center justify-center px-4 py-16">

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-2xl">

        <h2 className="text-2xl font-bold text-violet-700 mb-6 text-center">
          Edit Article
        </h2>

        <form onSubmit={handleSubmit(updateArticle)}>

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>

            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              {...register("title", { required: "Title required" })}
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              {...register("category", { required: "Category required" })}
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
              rows="14"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              {...register("content", { required: "Content required" })}
            />

            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <button
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-semibold hover:bg-violet-700 transition"
          >
            Update Article
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditArticle;