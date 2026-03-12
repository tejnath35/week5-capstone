import { NavLink, Outlet } from "react-router";

function AuthorProfile() {
  return (
    <div className="min-h-screen bg-amber-100 w-full p-5 m-auto ">

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