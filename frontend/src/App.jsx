import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, LogOut, User } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Booking from './pages/Booking';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="logo">Demra Turf</Link>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/booking" className="nav-link" onClick={() => setIsMenuOpen(false)}>Booking</Link>
            <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/gallery" className="nav-link" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            
            {user ? (
              <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                  <User size={18} /> {user.name}
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.875rem', borderColor: 'var(--border-color)', background: 'transparent'}}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{padding: '0.5rem 1.5rem'}} onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      <footer>
        <div className="container">
          <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Demra Turf Ground</h3>
          <p>Phone: 01XXXXXXXXX | WhatsApp: 01XXXXXXXXX</p>
          <p style={{margin: '0.5rem 0'}}>Address: Demra, Signboard, Dhaka</p>
          <p><a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer" style={{color: 'var(--primary)', fontWeight: 'bold'}}>Follow us on Facebook</a></p>
          <p style={{marginTop: '2rem', color: '#9ca3af', fontSize: '0.875rem'}}>&copy; {new Date().getFullYear()} Demra Turf Ground. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/8801XXXXXXXXX?text=I%20want%20to%20book%20a%20slot" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <MessageCircle size={32} />
      </a>
    </>
  );
}

export default App;
