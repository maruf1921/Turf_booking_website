import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Signup() {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section container">
      <div style={{maxWidth: '400px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)'}}>
        <h2 className="text-center" style={{marginBottom: '1.5rem', color: 'var(--primary)'}}>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" onChange={handleChange} required placeholder="Enter your full name" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" onChange={handleChange} required placeholder="01XXXXXXXXX" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center" style={{marginTop: '1.5rem'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: 'bold'}}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
