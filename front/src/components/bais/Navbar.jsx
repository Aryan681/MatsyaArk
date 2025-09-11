import React, { useEffect, useState, memo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GiCoral } from "react-icons/gi";
import { FaHome, FaPhoneAlt, FaTimes } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";

// Memoize the component for performance optimization
const Navbar = memo(({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#87CEFA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-layout-dashboard"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      name: "Detection",
      path: "/fish",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C7 2 4 6 4 10s2 8 8 8 8-4 8-8-3-8-8-8Z" />
          <path d="M12 12l3-3" />
        </svg>
      ),
    },
    { name: "Coral", path: "/coral", icon: <GiCoral /> },
    { name: "Contact", path: "/contact", icon: <FaPhoneAlt /> },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Use a custom component for the video logo to improve code reuse and readability
  const VideoLogo = memo(({ size = "w-10 h-10", isMobile = false }) => (
    <video
      src="/fish.webm"
      autoPlay
      loop
      muted
      playsInline
      className={`${size} rounded-full object-cover ${isMobile ? 'hover:scale-110' : ''} transition-transform`}
      aria-label="MatsyaArk Logo Animation"
      // Add a fallback source for broader browser compatibility
      preload="auto"
      crossOrigin="anonymous"
    >
      <source src="/fish.mp4" type="video/mp4" />
    </video>
  ));

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "easeInOut", stiffness: 60 }}
        className={`hidden md:flex flex-col ${
          isCollapsed ? "w-20" : "w-64"
        } min-h-screen bg-gradient-to-b from-[#031926]/90 via-[#061d2e]/80 to-[#000814]/90 backdrop-blur-xl shadow-xl border-r border-cyan-400/10 p-4 fixed top-0 left-0 z-40 transition-all duration-300`}
        role="navigation"
        aria-label="Main Navigation"
      >
        <button
          className="flex items-center gap-3 p-2 rounded-md hover:bg-cyan-900/20 transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <VideoLogo />
          {!isCollapsed && (
            <h1 className="text-xl font-bold tracking-wide text-cyan-300">
              MatsyaArk
            </h1>
          )}
        </button>

        <nav className="flex flex-col gap-4 mt-6">
          {navItems.map(({ name, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white text-base transition-all hover:text-cyan-200 hover:bg-cyan-400/10 ${
                  isActive
                    ? "bg-cyan-400/10 border-l-4 border-cyan-300"
                    : "border-l-4 border-transparent"
                }`}
                aria-current={isActive ? "page" : undefined}
                title={name}
              >
                <span className="text-xl text-cyan-400">{icon}</span>
                {!isCollapsed && name}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Mobile Icon Bar */}
      <div className="md:hidden fixed top-0 left-0 z-50 flex flex-col bg-[#031926]/95 backdrop-blur-md w-16 h-full items-center py-6 shadow-lg border-r border-cyan-700/20"
           role="navigation"
           aria-label="Mobile Navigation">
        <button
          className="mb-8 focus:outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open Navigation"
          aria-expanded={isOpen}
        >
          <VideoLogo size="w-8 h-8" isMobile={true} />
        </button>
        <div className="flex flex-col gap-6 text-cyan-400 text-lg">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={name}
              to={path}
              className="hover:text-cyan-300 transition"
              title={name}
              aria-current={location.pathname === path ? "page" : undefined}
              onClick={() => setIsOpen(false)} // Added for consistency
            >
              {icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Full Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="fixed top-0 left-0 z-50 w-64 h-full bg-gradient-to-b from-[#031926] to-[#000814] backdrop-blur-lg p-6 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <VideoLogo size="w-8 h-8" />
                  <span className="text-lg font-bold text-cyan-300">MatsyaArk</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-300 hover:text-cyan-100 text-xl"
                  aria-label="Close Navigation"
                >
                  <FaTimes />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {navItems.map(({ name, path, icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={name}
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white text-base transition-all hover:text-cyan-200 hover:bg-cyan-400/10 ${
                        isActive
                          ? "bg-cyan-400/10 border-l-4 border-cyan-300"
                          : "border-l-4 border-transparent"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="text-xl text-cyan-400">{icon}</span>
                      {name}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;