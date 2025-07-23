import React, { useState } from 'react'
import Navbar from '../components/bais/Navbar'
import Footer from '../components/bais/Footer'
import { Outlet } from 'react-router-dom'

export default function Base() {
  const [isCollapsed, setIsCollapsed] = useState(false); // sidebar state

  return (
    <div className="flex flex-col min-h-screen text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main content adjusts based on sidebar width */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out  text-gray-800 ${
            isCollapsed ? 'ml-20' : 'ml-62'
          }`}
        >
          <Outlet />
        </main>
      </div>

      
      
    </div>
  );
}
