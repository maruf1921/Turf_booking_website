import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Booking({ user }) {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    duration: '90 minutes',
    teamName: '',
    bkash_number: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [turfConfig, setTurfConfig] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/bookings/config')
      .then(res => res.json())
      .then(data => setTurfConfig(data.turf));
  }, []);

  useEffect(() => {
    if (formData.date) {
      fetch(`http://localhost:5000/api/bookings/availability?date=${formData.date}`)
        .then(res => res.json())
        .then(data => {
            setAvailableSlots(data.availableSlots || []);
            setFormData(prev => ({...prev, timeSlot: ''}));
        });
    }
  }, [formData.date]);

  useEffect(() => {
    if (turfConfig && formData.date && formData.timeSlot) {
      const d = new Date(formData.date);
      const day = d.getDay();
      let base = turfConfig.day_price;
      if (day === 5) base = turfConfig.friday_price;
      else {
          const isPM = formData.timeSlot.includes('PM') && !formData.timeSlot.startsWith('12PM');
          let hour = parseInt(formData.timeSlot);
          if (isPM) hour += 12;
          if (hour >= 17) base = turfConfig.evening_price;
      }
      let finalPrice = formData.duration === '3 hours' ? base * 2 : base;
      if (turfConfig.discount_percentage > 0) {
          finalPrice = finalPrice - (finalPrice * (turfConfig.discount_percentage / 100));
      }
      setEstimatedPrice(finalPrice);
    } else {
      setEstimatedPrice(0);
    }
  }, [turfConfig, formData.date, formData.timeSlot, formData.duration]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        alert('Please login to book a slot.');
        navigate('/login');
        return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            date: formData.date,
            time_slot: formData.timeSlot,
            duration: formData.duration,
            team_name: formData.teamName,
            bkash_number: formData.bkash_number
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Booking request received! Please wait for admin approval.');
        navigate('/dashboard');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="section container">
      <h1 className="section-title">Book Your Slot</h1>
      
      <div style={{maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)'}}>
        <form onSubmit={handleSubmit}>
          
          <h3 style={{color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem'}}>Step 1 - Pick a slot</h3>
          
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required 
            />
          </div>
          
          {formData.date && (
            <div className="form-group">
              <label>Time Slot</label>
              {availableSlots.length === 0 ? (
                  <p style={{color: 'red'}}>No slots available for this date.</p>
              ) : (
                  <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
                    <option value="" disabled>Select a slot</option>
                    {availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
              )}
            </div>
          )}
          
          <div className="form-group">
            <label>Duration</label>
            <select name="duration" value={formData.duration} onChange={handleChange} required>
              <option value="90 minutes">90 minutes</option>
              <option value="3 hours">3 hours</option>
            </select>
          </div>

          <h3 style={{color: 'var(--primary)', marginBottom: '1.5rem', marginTop: '2.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem'}}>Step 2 - Your details</h3>
          
          {user ? (
              <p style={{marginBottom: '1rem'}}>Booking as: <strong>{user.name}</strong> ({user.phone})</p>
          ) : (
              <p style={{marginBottom: '1rem', color: 'red'}}>You must be logged in to book.</p>
          )}

          <div className="form-group">
            <label>Team Name (Optional)</label>
            <input type="text" name="teamName" value={formData.teamName} onChange={handleChange} placeholder="Enter your team name" />
          </div>

          <div className="form-group">
            <label>bKash Transaction Number (Optional - For Advance Payment)</label>
            <input type="text" name="bkash_number" value={formData.bkash_number} onChange={handleChange} placeholder="TrxID (Leave blank if paying later)" />
          </div>

          <div style={{marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-alt)', borderRadius: '0.5rem', border: '1px solid #bbf7d0'}}>
            <h3 style={{color: 'var(--primary-dark)', marginBottom: '0.5rem'}}>Step 3 - Confirm</h3>
            
            {estimatedPrice > 0 && (
              <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem'}}>
                Estimated Total: ৳{estimatedPrice}
              </div>
            )}

            <p style={{fontSize: '0.95rem', marginBottom: '1.5rem'}}>
              After submitting, we will verify your bKash payment. You can also confirm via WhatsApp.
            </p>
            <button type="submit" className="btn btn-primary btn-block" disabled={!formData.timeSlot || !user} style={{fontSize: '1.1rem', padding: '1rem'}}>
              Request Booking
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Booking;
