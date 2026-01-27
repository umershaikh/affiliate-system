import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate, // Added Navigate for redirection
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

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="App">
      {!isLoginPage && <Header />}
      
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

          {/* This handles the "wrong link" by redirecting to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isLoginPage && <Footer />}
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