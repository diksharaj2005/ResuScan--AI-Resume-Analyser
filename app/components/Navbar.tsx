import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between items-center bg-gradient-to-b from-gray-100 to-gray-600 rounded-full p-3 w-full md:px-8 px-5 max-w-[1200px] mx-auto gap-10 m-5 md:m-8">
      <Link to="/">
        <p className="flex items-center text-2xl font-extrabold text-shadow-lg font-stretch-50%">
          <span className="bg-gradient-to-bl from-black to-blue-900 bg-clip-text text-transparent">
            Resu
          </span>
          <img src="/logo.gif" alt="Logo" className="h-6 w-auto inline-block" />
          <span className="bg-gradient-to-bl from-blue-900 to-black bg-clip-text text-transparent">
            Scan
          </span>
        </p>
      </Link>

      <Link
        to="/upload"
        className="bg-blue-800 px-4 py-2 rounded-full w-fit text-white cursor-pointer "
      >
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
