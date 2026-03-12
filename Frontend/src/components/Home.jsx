import React from "react";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col m-auto items-center justify-center h-full bg-gray-200 rounded-2xl text-center p-10">

      <h1 className="text-5xl font-bold text-indigo-400 mb-6">
        Welcome to Our Platform
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        Discover amazing content, explore articles written by talented authors,
        and become part of a growing community. Start reading or publishing today.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-400 text-white px-6 py-3 rounded-lg hover:bg-indigo-400 transition"
        >
          LOGIN
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Get Started
        </button>
      </div>

    </div>
  );
}

export default Home;