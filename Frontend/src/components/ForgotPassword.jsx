import { useForm } from "react-hook-form";
import { NavLink } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";

function ForgotPassword() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("https://week5-capstone.onrender.com/common-api/forgot-password", data);
      toast.success("Password reset successfully. You can now log in with your new password.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 w-full m-auto bg-linear-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-md">

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

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

          {/* New Password */}
          <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">
              New Password
            </label>

            <input
              type="password"
              {...register("newPassword", { required: true })}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Remember your password?{" "}
          <NavLink
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign In
          </NavLink>
        </p>
      </div>

    </div>
  );
}

export default ForgotPassword;