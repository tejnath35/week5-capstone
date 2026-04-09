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
  const loading = useAuth((state) => state.loading);

  const navigate = useNavigate();

  // Handle login submit
  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
  };

  // Redirect if already logged in OR after login
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    toast.success("Logged in successfully");

    const routes = {
      USER: "/user-profile",
      AUTHOR: "/author-profile",
      ADMIN: "/admin-profile",
    };

    navigate(routes[currentUser.role] || "/");

  }, [isAuthenticated, currentUser, navigate]);

  return (
    <div className="min-h-screen px-4 w-full flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100">

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-md">

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Sign In
        </h2>

        {/* Error */}
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
              onChange={() => useAuth.setState({ error: null })}
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
              onChange={() => useAuth.setState({ error: null })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right mb-5">
            <NavLink
              to="/forgot-password"
              className="text-blue-600 text-xs hover:text-blue-800"
            >
              Forgot password?
            </NavLink>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
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