import React, { useState } from 'react';
import Navbar from '../components/bais/Navbar';
import Footer from '../components/bais/Footer';
import { Outlet } from 'react-router-dom';

export default function Base() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#00a9ec] text-white overflow-hidden">
      {/* Ocean Bubble Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => {
          const size = Math.random() * 8 + 4;
          const left = Math.random() * 100;
          const bottom = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = Math.random() * 12 + 8;

          return (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `${bottom}%`,
                animation: `rise ${duration}s ease-in infinite`,
                animationDelay: `${delay}s`,
                opacity: 0.6,
              }}
            ></div>
          );
        })}
        <style>
          {`
            @keyframes rise {
              0% {
                transform: translateY(0);
                opacity: 0.6;
              }
              100% {
                transform: translateY(-100vh);
                opacity: 0;
              }
            }
          `}
        </style>
      </div>

      {/* Content Area */}
      <div className="relative flex flex-1 z-10">
        {/* Sidebar */}
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <main
          className={`flex-1 text-gray-800 transition-all duration-300 ease-in-out
            md:ml-${isCollapsed ? '20' : '64'} 
            ml-16
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
