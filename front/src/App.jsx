import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./layout/Base";
import HeroPage from "./pages/HeroPage";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout Route */}
         <Route path="/home" element={<HeroPage />} />
        <Route element={<Base />}>
         <Route path="/contact" element={<Contact/>} />
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
