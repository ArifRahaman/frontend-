// components/ui/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black bg-opacity-60 backdrop-blur-lg border-b border-gray-800 px-8 py-4 shadow-lg">
      <Link
        to="/"
        className="text-2xl font-extrabold text-white tracking-wide hover:text-blue-400 transition duration-300"
      >
        Brand
      </Link>

      <div className="flex items-center gap-6 text-gray-300">
        <Link
          to="/"
          className="hover:text-white transition-colors duration-300 font-medium text-lg"
        >
          Home
        </Link>

        {user ? (
          <>
            <Link
              to="/create"
              className="hover:text-white transition-colors duration-300 font-medium text-lg"
            >
              Create
            </Link>
                      <Link
              to="/chat"
              className="hover:text-white transition-colors duration-300 font-medium text-lg"
            >
              Chatai
            </Link>
            <Link
              to="/posts"
              className="hover:text-white transition-colors duration-300 font-medium text-lg"
            >
              PostList
            </Link>
            <Link
              to="/profile"
              className="hover:text-white transition-colors duration-300 font-medium text-lg flex items-center gap-2"
            >
              {/* Optional: add a user icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A9 9 0 1119.88 6.196 9 9 0 015.12 17.804z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {user.username || "Profile"}
            </Link>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-white transition-colors duration-300 font-medium text-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-white transition-colors duration-300 font-medium text-lg"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
