import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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

function App() {
  return (
    <div className="App">
      {/* Header and Footer now show on every single page automatically */}
      <Header />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Catch-all: redirects unknown URLs to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// Wrapping in Router to enable navigation features
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}