import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Rstore/authStore";
import { useEffect, useState } from "react";
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

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen px-4 w-full flex items-center justify-center bg-linear-to-br from-cyan-50 via-white to-slate-100">

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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                placeholder="••••••••"
                onChange={() => useAuth.setState({ error: null })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.024-5.81M6.1 6.1A9.97 9.97 0 0112 3c5.523 0 10 4.477 10 10 0 1.27-.214 2.485-.61 3.62M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-5">
            <NavLink
              to="/forgot-password"
              className="text-cyan-700 text-xs hover:text-cyan-900"
            >
              Forgot password?
            </NavLink>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-2.5 rounded-lg font-bold hover:bg-cyan-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="text-cyan-700 hover:text-cyan-900 font-medium"
          >
            Create one
          </NavLink>
        </p>
      </div>

    </div>
  );
}

export default Login;