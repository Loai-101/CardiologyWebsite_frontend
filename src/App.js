import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/Header/Header';
import Footer from './pages/Footer/Footer';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Insurance from './pages/Insurance/Insurance';
import Team from './pages/Team/Team';
import Contact from './pages/Contact/Contact';
import Appointment from './pages/Appointment/Appointment';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Admin from './pages/Admin/Admin';
import ControlPanel from './pages/ControlPanel/ControlPanel';
import Offers from './pages/Offers/Offers';
import ScrollToTop from './components/ScrollToTop';
import Loading from './components/Loading';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import './components/OptimizedComponents.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        {isLoading ? (
          <Loading onLoadingComplete={handleLoadingComplete} />
        ) : (
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/control-panel" element={<ControlPanel />} />
                <Route path="/offers" element={<Offers />} />
              </Routes>
            </main>
            <Footer />
          </div>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;
