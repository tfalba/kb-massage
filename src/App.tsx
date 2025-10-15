import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import ScrollToTop from "./helpers/ScrollToTop";
import SimpleModal from "./components/SimpleModal/SimpleModal";
import Services from "./pages/Services";
import EventTypes from "./components/EventTypes";

export default function App() {
  return (
    // <Router>
    <HashRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
      </Routes>
      <Footer />

      <SimpleModal>
        <EventTypes />
      </SimpleModal>
      </HashRouter>
    // </Router>
  );
}
