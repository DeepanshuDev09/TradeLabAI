import React, { useState } from "react";
import { Link } from "react-router";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [icon, setIcon] = useState("☰");

  const navClick = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen == false) {
      setIcon("X");
    }
    else {
      setIcon("☰");
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-[#0D0F14] border-b border-gray-500 shadow-md">

  <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-12 py-5">

    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
      TradeLab <span className="text-yellow-400">AI</span>
    </p>

    {/* Desktop Menu */}
    <div className="hidden md:flex gap-7 text-lg text-gray-400 font-medium">
      <Link to="/" className="hover:text-white">Home</Link>
      <Link to="/Dashboard" className="hover:text-white">Back-Testing</Link>
      <Link to="/Strategy" className="hover:text-white">Strategies</Link>
      <Link className="hover:text-white">Features</Link>
      <Link className="hover:text-white">About</Link>
    </div>

    {/* Mobile Button */}
    <button
      className="md:hidden text-white text-3xl"
      onClick={navClick}
    >
      {icon}
    </button>

  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden text-white text-center bg-[#0D0F14] border-t border-gray-700">
      <Link
        to="/"
        className="block px-6 py-4 hover:bg-gray-800"
        onClick={navClick}
      >
        Home
      </Link>

      <Link
        to="/Dashboard"
        className="block px-6 py-4 hover:bg-gray-800"
        onClick={navClick}
      >
        Back-Testing
      </Link>

      <Link to='/Strategy' className="block px-6 py-4 hover:bg-gray-800" onClick={navClick}>
        Strategies
      </Link>

      <Link className="block px-6 py-4 hover:bg-gray-800" onClick={navClick}>
        Features
      </Link>

      <Link className="block px-6 py-4 hover:bg-gray-800" onClick={navClick}>
        About
      </Link>
    </div>
  )}

</div>
  );
};

export default Navbar;