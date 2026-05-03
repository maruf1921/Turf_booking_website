import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        if (data.user.role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="section container">
      <div style={{maxWidth: '400px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)'}}>
        <h2 className="text-center" style={{marginBottom: '1.5rem', color: 'var(--primary)'}}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          <div style={{textAlign: 'right', marginBottom: '1rem'}}>
            <button type="button" onClick={() => alert('Forgot password flow (Mocked)')} style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem'}}>
              Forgot Password?
            </button>
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>
        <p className="text-center" style={{marginTop: '1.5rem'}}>
          Don't have an account? <Link to="/signup" style={{color: 'var(--primary)', fontWeight: 'bold'}}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
