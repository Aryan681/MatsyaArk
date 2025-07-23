import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./layout/Base";
import HeroPage from "./pages/HeroPage";
import Contact from "./pages/Contact";
import Coral from "./pages/Coral";
function App() {
  return (
    <Router>
      <Routes>
        {/* Layout Route */}
         <Route path="/home" element={<HeroPage />} />
        <Route element={<Base />}>
         <Route path="/contact" element={<Contact/>} />
         <Route path="/coral" element={<Coral/>} />
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
