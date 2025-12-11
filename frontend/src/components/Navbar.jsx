import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-textDark hover:bg-gray-50 hover:text-primary'
                }`}
            onClick={() => setIsMenuOpen(false)}
        >
            {children}
        </Link>
    );

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                            B
                        </div>
                        <span className="text-xl font-bold text-textDark tracking-tight">BusinessAI</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <NavLink to="/dashboard">Dashboard</NavLink>
                                <NavLink to="/business">Profile</NavLink>
                                <NavLink to="/chat">Chat</NavLink>

                                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-textSoft hover:text-red-600 font-medium transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-textDark hover:text-primary font-medium text-sm transition">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-secondary transition shadow-sm text-sm font-medium"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-textDark hover:text-primary focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 space-y-2 animate-fadeIn">
                        {user ? (
                            <>
                                <div className="px-3 py-2 flex items-center gap-3 mb-2 border-b border-gray-50 pb-4">
                                    <div className="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-textDark">{user.email}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <NavLink to="/dashboard">Dashboard</NavLink>
                                    <NavLink to="/business">Profile</NavLink>
                                    <NavLink to="/chat">Chat</NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 px-2">
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-2 text-textDark hover:bg-gray-50 rounded-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full text-center py-2 bg-primary text-white rounded-xl hover:bg-secondary font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
