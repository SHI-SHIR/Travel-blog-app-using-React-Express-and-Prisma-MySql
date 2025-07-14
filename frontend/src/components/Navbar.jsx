import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className="absolute top-0 left-0 w-full z-50 bg-transparent text-black drop-shadow-md"
      style={{ textShadow: "0px 0.5px 0px rgba(131, 127, 127, 1)" }}
    >
      <div className="flex justify-between items-center px-6 py-1 ">
        {/* Logo or Brand */}
        <div className="text-4xl font-bold ">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.svg" 
              alt="TalkToLocal"
              className="h-20 w-auto object-contain text-red-900"
            />
          </Link>
        </div>

        {/* Hamburger button (mobile) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-3xl">&#9776;</span>
        </button>

        {/* Links (desktop) */}
        <div className="hidden md:flex font-poppins space-x-6 text-2xl font-medium">
          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>
          <Link to="/blog" className="hover:text-yellow-400">
            Blog
          </Link>
          <Link to="/images" className="hover:text-yellow-400">
            Images
          </Link>
          <Link to="/about" className="hover:text-yellow-400">
            About
          </Link>

          {!localStorage.getItem("token") ? (
            <Link to="/login" className="hover:text-yellow-400">
              Log in
            </Link>
          ) : (
            <>
              <Link to="/create" className="hover:text-yellow-400">
                Create
              </Link>
              <button onClick={handleLogout} className="hover:text-yellow-400">
                Log out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden font-poppins flex flex-col items-center space-y-3 pb-4 text-xl font-medium">
          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>
          <Link to="/blog" className="hover:text-yellow-400">
            Blog
          </Link>
          <Link to="/images" className="hover:text-yellow-400">
            Images
          </Link>
          <Link to="/about" className="hover:text-yellow-400">
            About
          </Link>
          {!localStorage.getItem("token") ? (
            <Link to="/login" className="hover:text-yellow-400">
              Log in
            </Link>
          ) : (
            <>
              <Link to="/create" className="hover:text-yellow-400">
                Create
              </Link>
              <button onClick={handleLogout} className="hover:text-yellow-400">
                Log out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
