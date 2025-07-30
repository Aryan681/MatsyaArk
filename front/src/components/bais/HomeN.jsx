import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaRobot,
  FaPhoneAlt,
} from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { GiCoral } from "react-icons/gi";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/dashboard", icon: <AiFillDashboard /> },
    { name: "Detection", path: "/fish", icon: <BiSearch /> },
    { name: "Coral", path: "/coral", icon: <GiCoral /> },
    { name: "Contact", path: "/contact", icon: <FaPhoneAlt /> },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <nav className="w-full fixed top-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl bg-[#1d3c4e] text-white shadow-md rounded-3xl px-6 py-2 flex items-center justify-between">
        {/* Left - Logo */}
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "easeInOut", stiffness: 60 }}
          className="flex items-center gap-3"
        >
          <video
            src="/fish.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-xl font-bold tracking-wide text-cyan-300">
            MatsyaArk
          </h1>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map(({ name, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition hover:text-cyan-200 hover:bg-cyan-400/10 ${
                  isActive ? "bg-cyan-400/10 text-cyan-300" : "text-white"
                }`}
              >
                <span className="text-lg text-cyan-400">{icon}</span>
                {name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-cyan-300 hover:text-cyan-100"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 w-full max-w-5xl bg-[#031926] text-white rounded-xl mt-2 shadow-lg px-6 py-4 md:hidden"
          >
            {navItems.map(({ name, path, icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={name}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition hover:text-cyan-200 hover:bg-cyan-400/10 ${
                    isActive ? "bg-cyan-400/10 text-cyan-300" : "text-white"
                  }`}
                >
                  <span className="text-lg text-cyan-400">{icon}</span>
                  {name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
