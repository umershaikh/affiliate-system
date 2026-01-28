import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Importing your specific components
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Faq from "./Pages/Faq/Faq";
import Plan from "./Pages/Plan/Plan";
import Blog from "./Pages/Blog/Blog";
import Contact from "./Pages/Contact/Contact";
import Header from "./Pages/Home/Componenets/Header/Header";
import Footer from "./Pages/Home/Componenets/Footer/Footer";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Pages/Dashboard/Dashboard";

function AppContent() {
  const location = useLocation();

  // This array contains all paths where Header and Footer should be HIDDEN
  const noLayoutRequired = ["/login", "/dashboard"];
  
  // Checks if the current path is in the array above
  const isNoLayoutPage = noLayoutRequired.includes(location.pathname);

  return (
    <div className="App">
      {/* Header hidden on Login and Dashboard */}
      {!isNoLayoutPage && <Header />}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* This handles the "wrong link" by redirecting to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer hidden on Login and Dashboard */}
      {!isNoLayoutPage && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}