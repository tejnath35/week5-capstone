import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../Rstore/authStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

function Login() {
  const { register, handleSubmit } = useForm();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const error = useAuth((state) => state.error);

  const navigate = useNavigate();

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
  };

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    switch (currentUser.role) {
      case "USER":
        toast.success("Logged in successfully");
        navigate("/user-profile");
        break;

      case "AUTHOR":
        toast.success("Logged in successfully");
        navigate("/author-profile");
        break;

      case "ADMIN":
        toast.success("Logged in successfully");
        navigate("/admin-profile");
        break;

      default:
        navigate("/");
    }
  }, [isAuthenticated, currentUser, navigate]);

  return (
    <div className="h-188 w-full m-auto bg-amber-100 from-blue-50 via-white to-blue-100 flex items-center justify-center ">

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 mb-30 w-100 max-w-md">

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Sign In
        </h2>

        {/* Error message */}
        {error && (
          <p className="bg-red-100 text-red-600 border border-red-200 rounded-lg px-4 py-2 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onUserLogin)}>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>

            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>

            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right mb-5">
            <a
              href="/forgot-password"
              className="text-blue-600 text-xs hover:text-blue-800"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Create one
          </NavLink>
        </p>
      </div>

    </div>
  );
}

export default Login;