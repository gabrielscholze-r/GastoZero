import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext.jsx';
import Cookies from 'js-cookie';
import {Slide, toast} from "react-toastify";
import {FaSpinner} from "react-icons/fa";

export default function Sidebar({isOpen, setIsOpen}) {
    const {theme, toggleTheme} = useTheme();
    const navigate = useNavigate();
    const authToken = Cookies.get('authToken');

    const handleLogout = () => {
        Cookies.remove('authToken');
        toast.info(
            <div className="flex items-center gap-2">
                <FaSpinner  className="animate-spin" />
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
        )

        const timer = setTimeout(() => {
            navigate('/login')
        }, 2000)

        return () => clearTimeout(timer)
    }

    const authenticatedLinks = (
        <>
            <NavLink
                to="/"
                className="block text-xl font-bold hover:underline transition"
                onClick={() => setIsOpen(false)}
            >
                Home
            </NavLink>
            <NavLink
                to="/plans"
                className="block text-xl font-bold hover:underline transition"
                onClick={() => setIsOpen(false)}
            >
                Plans
            </NavLink>
            <NavLink
                to="/reports"
                className="block text-xl font-bold hover:underline transition"
                onClick={() => setIsOpen(false)}
            >
                Reports
            </NavLink>
            <NavLink
                to="/expenses"
                className="block text-xl font-bold hover:underline transition"
                onClick={() => setIsOpen(false)}
            >
                Expenses
            </NavLink>
        </>
    );

    const guestLinks = (
        <>
            <NavLink
                to="/login"
                className="block text-xl font-bold hover:underline transition"
                onClick={() => setIsOpen(false)}
            >
                Login
            </NavLink>
            <NavLink
                to="/register"
                className="block text-xl font-bold hover:underline transition"
                onClick={() => setIsOpen(false)}
            >
                Register
            </NavLink>
        </>
    );

    return (
        <>
            <div
                className="md:hidden flex items-center justify-between bg-containerbg text-textcontainerbg p-4 z-50 fixed top-0 left-0 w-full">
                <h1 className="text-xl font-bold">GastoZero</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex flex-col justify-between w-6 h-5"
                >
                    <span className="block w-full h-0.5 bg-textcontainerbg"></span>
                    <span className="block w-full h-0.5 bg-textcontainerbg"></span>
                    <span className="block w-full h-0.5 bg-textcontainerbg"></span>
                </button>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-containerbg text-textcontainerbg z-50 flex flex-col justify-between p-6 overflow-y-auto">
                    <div>
                        <div className="flex justify-between items-center mb-8 sticky top-0 bg-containerbg py-2">
                            <h1 className="text-xl font-bold">GastoZero</h1>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <nav className="space-y-6">
                            {authToken ? authenticatedLinks : guestLinks}
                        </nav>
                    </div>
                    <div className="mt-8">
                        <label className="block mb-2 text-base font-semibold">Theme:</label>
                        <select
                            value={theme}
                            onChange={(e) => toggleTheme(e.target.value)}
                            className="bg-textcontainerbg text-primary font-medium px-3 py-2 rounded text-base"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
            )}

            <div
                className="hidden md:flex flex-col justify-between w-1/5 min-h-screen bg-containerbg text-textcontainerbg py-8 px-6">
                <div className="space-y-6">
                    <h1 className="text-2xl">GastoZero</h1>
                    {authToken ? authenticatedLinks : guestLinks}
                </div>
                <div className="flex justify-between items-center">
                    <div>

                        <label className="block mb-2 text-base font-semibold">Theme:</label>
                        <select
                            value={theme}
                            onChange={(e) => toggleTheme(e.target.value)}
                            className="bg-textcontainerbg text-primary font-medium px-3 py-2 rounded text-base"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <div className="hover:cursor-pointer" onClick={handleLogout}>
                        <h3>
                            Log Out
                        </h3>
                    </div>
                </div>
            </div>
        </>
    );
}
