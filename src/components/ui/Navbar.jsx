import * as React from "react"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"

export default function Navbar() {
  const [state, setState] = React.useState(false)

  const menus = [
    { title: "Home", path: "/homepage" },
    { title: "Theaters", path: "/theaterPage" },
    { title: "Login", path: "/" },
  ]

  return (
    <nav className="bg-black/95 backdrop-blur-md w-full border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-4 md:py-5 md:block">
          <Link to="/" className="group">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-400 group-hover:from-purple-500 group-hover:to-yellow-300 transition-all duration-300">
              NextShow
            </h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-white outline-none p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              onClick={() => setState(!state)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-4 mt-4 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="ml-auto justify-end items-center space-y-4 md:flex md:space-x-2 lg:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li key={idx}>
                <Link 
                  to={item.path}
                  className="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/10 hover:text-purple-400 transition-all duration-200 block md:inline-block relative group"
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-yellow-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
