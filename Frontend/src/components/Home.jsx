import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Rstore/authStore";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const roleRoutes = {
    USER: "/user-profile",
    AUTHOR: "/author-profile",
    ADMIN: "/admin-profile",
  };

  const handleGetStarted = () => {
    if (!currentUser?.role) return;

    navigate(roleRoutes[currentUser.role] || "/");
  };

  return (
    <div className="flex flex-col mx-4 my-8 md:m-auto items-center justify-center h-full bg-gray-200 rounded-2xl text-center p-6 sm:p-10 w-full max-w-4xl">

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-400 mb-6">
        Welcome to Our Platform
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        Discover amazing content, explore articles written by talented authors,
        and become part of a growing community. Start reading or publishing today.
      </p>

      <div className="flex gap-4">
        {isAuthenticated ? (
          <button
            onClick={handleGetStarted}
            disabled={!currentUser}
            className="bg-indigo-400 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-400 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition"
          >
            LOGIN
          </button>
        )}
      </div>

    </div>
  );
}

export default Home;