import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', otp: '' });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) return alert('Fill all fields');
    alert('OTP Sent via SMS/WhatsApp! (Use 1234 for testing)');
    setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
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
        <h2 className="text-center" style={{marginBottom: '1.5rem', color: 'var(--primary)'}}>Create an Account</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" onChange={handleChange} required />
            </div>
            <button className="btn btn-primary btn-block">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label>Enter OTP (Sent to {formData.phone})</label>
              <input type="text" name="otp" onChange={handleChange} required placeholder="1234" />
            </div>
            <button className="btn btn-primary btn-block">Verify & Signup</button>
            <button type="button" onClick={() => setStep(1)} className="btn btn-outline btn-block" style={{marginTop: '1rem'}}>Back</button>
          </form>
        )}
        <p className="text-center" style={{marginTop: '1.5rem'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: 'bold'}}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
