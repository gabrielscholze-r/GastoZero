import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import Cookies from "js-cookie";
import { Slide, toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import ProtectedSidebar from "./ProtectedSidebar.jsx";
import { MdClose, MdMenu, MdLogout } from "react-icons/md";
import { queryClient } from '@tanstack/react-query'; 
export default function Sidebar({ isOpen, setIsOpen, setPlan, selectedPlan }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    const current = Cookies.get("theme");
    if (current) {
      toggleTheme(current);
    }
  }, [toggleTheme]);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("graphType");
    queryClient.invalidateQueries(['plans']);
    toast.info(
      <div className="flex items-center gap-2">
        <FaSpinner className="animate-spin" />
        <span>Logged out successfully!</span>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
        transition: Slide,
      }
    );
    setTimeout(() => navigate("/login"), 2000);
  };

  const authenticatedLinks = (
    <ProtectedSidebar
      setIsOpen={setIsOpen}
      setPlan={setPlan}
      selectedPlan={selectedPlan}
      handleLogout={handleLogout}
    />
  );

  const guestLinks = (
    <div className="space-y-4">
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `block text-xl font-semibold cursor-pointer hover:opacity-85 transition-opacity0 ${
            isActive ? "underline font-bold" : ""
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        Login
      </NavLink>
      <NavLink
        to="/register"
        className={({ isActive }) =>
          `block text-xl font-semibold cursor-pointer hover:opacity-85 transition-opacity ${
            isActive ? "underline font-bold" : ""
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        Register
      </NavLink>
    </div>
  );

  return (
    <>
      {/* Mobile Header (Fixed Top) */}
      <div className="md:hidden flex items-center justify-between bg-containerbg text-textcontainerbg p-4 z-50 fixed top-0 left-0 w-full shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide">SpendZero</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="text-textcontainerbg text-3xl p-1 rounded-md hover:bg-opacity-10 transition"
          aria-label="Open sidebar"
        >
          <MdMenu />
        </button>
      </div>

      {/* Mobile Sidebar (Full Screen Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 bg-containerbg text-textcontainerbg z-50 flex flex-col justify-between p-6 overflow-y-auto transform transition-transform duration-300 ease-out animate-slide-in-right">
          <div>
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-containerbg py-2 z-10">
              <h1 className="text-2xl font-extrabold tracking-wide">
                SpendZero
              </h1>
              <button
                onClick={() => setIsOpen(false)}
                className="text-textcontainerbg text-3xl p-1 rounded-md hover:bg-opacity-10 transition"
                aria-label="Close sidebar"
              >
                <MdClose />
              </button>
            </div>
            <nav className="space-y-6">
              {authToken ? authenticatedLinks : guestLinks}
            </nav>
          </div>
          <div className="mt-8 pt-4 border-t border-textcontainerbg border-opacity-20">
            <label
              htmlFor="mobile-theme-select"
              className="block mb-2 text-base font-semibold text-textcontainerbg"
            >
              Theme:
            </label>
            <select
              id="mobile-theme-select"
              value={theme}
              onChange={(e) => toggleTheme(e.target.value)}
              className="w-full bg-textcontainerbg text-primary font-medium px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gold appearance-none"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            {authToken && (
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 text-xl font-semibold p-2 rounded-lg bg-gray-600 hover:bg-red-800 transition duration-200 text-textcontainerbg mt-4"
              >
                <MdLogout className="text-2xl" /> Log Out
              </button>
            )}
          </div>
        </div>
      )}

      <div className="hidden md:flex flex-col justify-between w-64 min-h-screen bg-containerbg text-textcontainerbg py-8 px-6 shadow-lg">
        <div className="space-y-8">
          <h1 className="text-3xl font-extrabold tracking-wide">SpendZero</h1>
          <nav className="space-y-6">
            {authToken ? authenticatedLinks : guestLinks}
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="desktop-theme-select"
              className="block mb-2 text-base font-semibold text-textcontainerbg"
            >
              Theme:
            </label>
            <select
              id="desktop-theme-select"
              value={theme}
              onChange={(e) => toggleTheme(e.target.value)}
              className="w-full bg-textcontainerbg text-primary font-medium px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gold appearance-none cursor-pointer hover:opacity-85 transition-opacity"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          {authToken && (
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 rounded-lg bg-gray-600 hover:bg-red-800 transition duration-200 text-textcontainerbg font-semibold"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}