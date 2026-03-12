import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

function Register() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    try {
      let { role, ...userObj } = newUser;

      if (role === "user") {
        let resObj = await axios.post(
          "http://localhost:4000/user-api/users",
          userObj
        );

        if (resObj.status === 201) {
          navigate("/login");
        }
      }

      if (role === "author") {
        let resObj = await axios.post(
          "http://localhost:4000/author-api/users",
          userObj
        );

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
      <p className="text-center text-lg font-semibold text-violet-600 mt-20">
        Loading...
      </p>
    );
  }

  return (
    <div className="h-188.5  w-full m-auto bg-amber-100  flex items-center justify-center ">
      <div className="w-100  bg-white shadow-xl rounded-2xl p-5 border border-violet-100">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-3">
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
                  className="accent-violet-600 w-4 h-4"
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
                  className="accent-violet-600 w-4 h-4"
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
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
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
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm font-medium text-stone-700">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              placeholder="Min. 8 characters"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
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
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2.5 rounded-lg font-semibold hover:bg-violet-700 transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-3">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-violet-600 font-semibold hover:text-violet-500"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;