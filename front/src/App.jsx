import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import the base layout component
import Base from "./layout/Base";

// Lazy-load the page components
const HeroPage = lazy(() => import("./pages/HeroPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Coral = lazy(() => import("./pages/Coral"));
const Fish = lazy(() => import("./pages/Fish"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Layout Route */}
          <Route path="/" element={<HeroPage />} />
          <Route element={<Base />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/coral" element={<Coral />} />
            <Route path="/fish" element={<Fish />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;