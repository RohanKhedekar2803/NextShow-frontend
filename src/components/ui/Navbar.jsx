import * as React from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [username, setUsername] = React.useState(
    () => localStorage.getItem("username")
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const isLoggedIn = Boolean(username);

  const navigate = useNavigate();

  const menus = [
    { title: "Home", path: "/homepage" },
    { title: "Theaters", path: "/theaterPage" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setUsername(null);
    navigate("/")
    };

  return (
    <nav className="bg-black/95 backdrop-blur-md w-full border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand */}
          <Link to="/" className="group">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-400">
              NextShow
            </h1>
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-5">
            {menus.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="text-white font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                {item.title}
              </Link>
            ))}

            {!isLoggedIn ? (
              <Link
                to="/"
                className="text-white font-semibold px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 font-medium">👤 {username}</span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4">
            {menus.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="text-white font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition"
              >
                {item.title}
              </Link>
            ))}

            {!isLoggedIn ? (
              <Link
                to="/"
                className="text-white font-semibold px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white font-semibold px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}