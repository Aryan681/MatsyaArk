import React, { useEffect, useState } from "react";
import Navbar from "../components/bais/Navbar";
import Footer from "../components/bais/Footer";
import { Outlet } from "react-router-dom";
import Loading from "../components/loding/Loading"; // import loader

export default function Base() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate a short delay, you can replace this with actual loading condition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
    <div className="relative flex flex-col min-h-screen bg-[#00a9ec] text-white overflow-hidden">
  

      {/* Content Area */}
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
    </>
  );
}
