import * as React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const [username, setUsername] = React.useState(
    () => localStorage.getItem("username")
  );

  const isLoggedIn = Boolean(username);

  const menus = [
    { title: "Home", path: "/homepage" },
    { title: "Theaters", path: "/theaterPage" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setUsername(null);
  };

  return (
    <nav className="bg-black/95 backdrop-blur-md w-full border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4">

          {/* Brand (LEFT) */}
          <Link to="/" className="group">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-400">
              NextShow
            </h1>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-5">
            {/* Menus */}
            {menus.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="text-white font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                {item.title}
              </Link>
            ))}

            {/* Auth */}
            {!isLoggedIn ? (
              <Link
                to="/"
                className="text-white font-semibold px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Username */}
                <span className="text-gray-300 font-medium">
                  👤 {username}
                </span>

                {/* Logout icon */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="
                    p-2
                    rounded-full
                    border border-purple-500
                    text-purple-400
                    hover:bg-purple-600
                    hover:text-white
                    transition
                  "
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
