import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../Rstore/authStore";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className="bg-white-600 border-b border-gray-300 sticky ">
      <div className="mx-auto px-6 h-15 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-lg font-semibold tracking-tight text-gray-900"
        >
          MyBlog
        </NavLink>

        <ul className="flex justify-between gap-8 text-sm">

          {/* Always visible */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900 transition font-semibold"
              }
            >
              Home
            </NavLink>
          </li>

          {/* Not logged in */}
          {!isAuthenticated || !user ? (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition font-semibold"
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition font-semibold"
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              {/* Logged in */}
              <li>
                <NavLink
                  to={getProfilePath()}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900 transition"
                  }
                >
                  Profile
                </NavLink>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;