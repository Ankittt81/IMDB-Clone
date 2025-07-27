import Logo from "../Movielogo.png";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors duration-300 ${
        isDark
          ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
          : "bg-gray-700 text-yellow-400 hover:bg-gray-600"
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

function Navbar() {
  const { isDark } = useTheme();

  return (
    <div
      className={`px-4 py-4 transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        <div className="flex items-center space-x-4">
          <img className="w-[60px] sm:w-[70px]" src={Logo} alt="Logo" />
          <span className="text-2xl sm:text-3xl font-bold text-blue-400">
            CineZone
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            Movies
          </Link>
          <Link
            to="/Watchlist"
            className="text-xl sm:text-2xl font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            Watchlist
          </Link>
          <Link
            to="/Recommend"
            className="text-xl sm:text-2xl font-semibold text-blue-400 hover:text-blue-300 transition text-center"
          >
            Recommendations
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
         
        </div>
      </div>
    </div>
  );
}

export default Navbar;
