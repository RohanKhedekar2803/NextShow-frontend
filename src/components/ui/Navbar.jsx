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
    <nav className="bg-black w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link to="/">
            <h1 className="text-3xl font-bold text-purple-600">NextShow</h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-300 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="ml-auto justify-end items-center mt-2 space-y-8 md:flex md:space-x-6 md:space-y-0 text-purple-600">
            {menus.map((item, idx) => (
              <li key={idx} className="text-white font-semibold hover:text-indigo-400">
                <Link to={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
