import { NavLink, Outlet } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

function AuthorProfile() {
  const [author, setAuthor] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/author-api/profile",
          { withCredentials: true }
        );
        setAuthor(res.data.payload);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchAuthorProfile();
  }, []);

  return (
    <div className="min-h-screen w-full p-5 m-auto ">
      <div>
        <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
      </div>

      {/* Author Profile Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6 mt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm uppercase tracking-wide">Author Name</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">
              {author.firstName} {author.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm uppercase tracking-wide">Email ID</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">{author.email}</p>
          </div>
        </div>
      </div>

      {/* Author Navigation */}
      <div className="flex gap-6 mb-1 mt-0 font-bold ">

        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive
              ? "text-violet-600 font-semibold border-b-2 border-violet-600 pb-1"
              : "text-gray-600 hover:text-violet-600 pb-1"
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive
              ? "text-violet-600 font-semibold border-b-2 border-violet-600 pb-1"
              : "text-gray-600 hover:text-violet-600 pb-1"
          }
        >
          Write Article
        </NavLink>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-400 mb-6"></div>

      {/* Nested route content */}
      <Outlet />

    </div>
  );
}

export default AuthorProfile;