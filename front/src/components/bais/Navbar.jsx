import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaRobot,
  FaTimes,
} from "react-icons/fa";

export default function Navbar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile

  const navItems = [
    { name: "Home", path: "/home", icon: <FaHome /> },
    {
      name: "Dashboard",
      path: "/Dashboard",
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
      path: "/model-one",
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
    {
      name: "Coral",
      path: "/coral",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
    },
    { name: "Research", path: "/research", icon: <FaRobot /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", path: "/contact", icon: <FaPhoneAlt /> },
  ];

  useEffect(() => {
    setIsOpen(false); // close mobile menu on route change
  }, [location.pathname]);

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
      >
        <button
          className="flex items-center gap-3 p-2 rounded-md hover:bg-cyan-900/20 transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <video
            src="/fish.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-10 h-10 rounded-full object-cover"
          />
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
              >
                <span className="text-xl text-cyan-400">{icon}</span>
                {!isCollapsed && name}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Mobile Icon Bar */}
      <div className="md:hidden fixed top-0 left-0 z-50 flex flex-col bg-[#031926]/95 backdrop-blur-md w-16 h-full items-center py-6 shadow-lg border-r border-cyan-700/20">
        <button
          className="mb-8 focus:outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open Navigation"
        >
          <video
            src="/fish.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-8 h-8 rounded-full object-cover hover:scale-110 transition-transform"
          />
        </button>
        <div className="flex flex-col gap-6 text-cyan-400 text-lg">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={name}
              to={path}
              className="hover:text-cyan-300 transition"
              title={name}
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
                  <video
                    src="/fish.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-8 h-8 rounded-full object-cover"
                  />
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white text-base transition-all hover:text-cyan-200 hover:bg-cyan-400/10 ${
                        isActive
                          ? "bg-cyan-400/10 border-l-4 border-cyan-300"
                          : "border-l-4 border-transparent"
                      }`}
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
}
