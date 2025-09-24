import './App.css';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import About from './pages/About';
import Services from './pages/Services';
import ScrollToTop from './helpers/ScrollToTop';
import MyCalendlyAlt from './components/MyCalendlyAlt';
import SimpleModal from './components/SimpleModal/SimpleModal';
import ServicesAlt from './pages/ServicesAlt';
import EventTypesAlt from './components/EventTypesAlt';


export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services-alt" element={<ServicesAlt />} />
        {/* <Route path="booking" element={<MyCalendly />} />
          <Route path="booking-alt" element={<MyCalendlyAlt />} /> */}
      </Routes>
      <Footer />

        <SimpleModal>
          <EventTypesAlt style={{ width: '100%' }} />
        </SimpleModal>

    </Router>
  );
}
