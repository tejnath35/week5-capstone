import { useForm } from "react-hook-form";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { API_URL } from '../utils/api';

function ForgotPassword() {

  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const navigate = useNavigate();

  const requestCode = async ({ email: submittedEmail }) => {
    try {
      const response = await axios.post(`${API_URL}/common-api/forgot-password/request`, { email: submittedEmail });
      setEmail(submittedEmail);
      setStep(2);
      toast.success(response.data.verificationCode
        ? `Verification code: ${response.data.verificationCode}`
        : "Verification code sent. Check your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const resetPassword = async ({ newPassword }) => {
    try {
      await axios.post(`${API_URL}/common-api/forgot-password/reset`, {
        email,
        verificationCode,
        newPassword,
      });
      toast.success("Password reset successfully. You can now log in with your new password.");
      navigate("/login");
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

          <form onSubmit={handleSubmit(step === 1 ? requestCode : resetPassword)}>

          {/* Email */}
          {step === 1 ? <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>

            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> : <>
            <p className="mb-5 text-sm text-gray-600">Enter the verification code sent to {email}.</p>
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-1">Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </>}

          {/* New Password */}
          {step === 2 && <div className="mb-5">
            <label className="block text-sm text-gray-600 mb-1">
              New Password
            </label>

            <input
              type="password"
              {...register("newPassword", { required: true })}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2.5 rounded-lg font-bold hover:bg-cyan-700 transition"
          >
            {step === 1 ? "Send verification code" : "Reset Password"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Remember your password?{" "}
          <NavLink
            to="/login"
            className="text-cyan-700 hover:text-cyan-900 font-medium"
          >
            Sign In
          </NavLink>
        </p>
      </div>

    </div>
  );
}

export default ForgotPassword;