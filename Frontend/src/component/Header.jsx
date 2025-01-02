import React from "react";
import { useAuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
        </div>
        <a href="/Home" className="btn btn-ghost text-xl">
          SE NPRU Blog
        </a>
      </div>

      <div className="navbar-end flex space-x-4">
        {user ? (
          <>
            <a href="/create" className="btn text-[#fbeaff] bg-[#1230AE] hover:bg-[#6C48C5] hover:text-white">
              Create a New Post
            </a>
            <button onClick={logout} className="btn text-[#fbeaff] bg-red-600 hover:bg-red-700 hover:text-white">
              Logout ({user.username})
            </button>
          </>
        ) : (
          <>
            <a href="/Login" className="btn text-[#fbeaff] bg-[#1230AE] hover:bg-[#6C48C5] hover:text-white">
              Login
            </a>
            <a href="/Register" className="btn text-[#fbeaff] bg-[#1230AE] hover:bg-[#6C48C5] hover:text-white">
              Register
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;