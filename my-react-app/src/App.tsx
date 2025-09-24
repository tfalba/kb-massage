import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Account from './pages/Account';
import Services from './pages/Services';
import FAQ from './pages/FAQ';
import BookNow from './pages/BookNow';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/account" component={Account} />
          <Route path="/services" component={Services} />
          <Route path="/faq" component={FAQ} />
          <Route path="/book-now" component={BookNow} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
};

export default App;