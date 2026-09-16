import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import { API_URL } from '../utils/api';

function Register() {

  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    try {
      let { role, ...userObj } = newUser;

      if (role === "user") {
        let resObj = await axios.post(`${API_URL}/user-api/users`, userObj, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });

        if (resObj.status === 201) {
          navigate("/login");
        }
      }

      if (role === "author") {
        let resObj = await axios.post(`${API_URL}/author-api/users`, userObj, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        });

        if (resObj.status === 201) {
          navigate("/login");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-semibold text-cyan-700 mt-20">
        Loading...
      </p>
    );
  }

  return (
  <div className="min-h-screen px-4 py-10 w-full m-auto flex items-center justify-center bg-linear-to-br from-cyan-50 to-slate-100">
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-cyan-100">

      {/* Title */}
      <h2 className="text-2xl font-bold text-center text-cyan-800 mb-3">
        Create an Account
      </h2>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit(onUserRegister)}>

        {/* Role Selection */}
        <div className="mb-3">
          <p className="text-sm font-semibold text-stone-700">
            Register as
          </p>

          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("role")}
                value="user"
                className="accent-cyan-600 w-4 h-4"
              />
              <span className="text-sm font-medium text-stone-700">
                User
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("role")}
                value="author"
                className="accent-cyan-600 w-4 h-4"
              />
              <span className="text-sm font-medium text-stone-700">
                Author
              </span>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 my-5"></div>

        {/* First Name & Last Name */}
        <div className="sm:flex gap-4 mb-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-stone-700">
              First Name
            </label>

            <input
              type="text"
              {...register("firstName")}
              placeholder="First name"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-stone-700">
              Last Name
            </label>

            <input
              type="text"
              {...register("lastName")}
              placeholder="Last name"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-stone-700">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium text-stone-700">
            Password
          </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Min. 8 characters"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
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

        {/* Profile Image URL */}
        <div className="mb-5">
          <label className="text-sm font-medium text-stone-700">
            Profile Image URL
          </label>

          <input
            type="text"
            {...register("profileImageUrl")}
            placeholder="https://example.com/avatar.png"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-2.5 rounded-lg font-bold hover:bg-cyan-700 transition"
        >
          Create Account
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center mt-3">
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="text-cyan-700 font-semibold hover:text-cyan-900"
        >
          Sign in
        </NavLink>
      </p>
    </div>
  </div>
);
}

export default Register;