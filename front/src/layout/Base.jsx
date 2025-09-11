import React, { useEffect, useState, memo } from "react";
import Navbar from "../components/bais/Navbar";
import Footer from "../components/bais/Footer";
import { Outlet } from "react-router-dom";
import Loading from "../components/loding/Loading";

const Base = memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {

    const loadingTimeout = setTimeout(() => {
      setIsAppReady(true);
    }, 500); // A shorter, more realistic timeout

    return () => clearTimeout(loadingTimeout);
  }, []);

  if (!isAppReady) {
    return <Loading />;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[#00a9ec] text-white overflow-hidden">
      <div className="relative flex flex-1 z-10">
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main
          className={`flex-1 text-gray-800 transition-all duration-300 ease-in-out
            md:ml-${isCollapsed ? "20" : "64"}
            ml-16
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
});

export default Base;