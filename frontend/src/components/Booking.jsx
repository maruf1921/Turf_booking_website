import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Booking({ user }) {
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [turfId, setTurfId] = useState(1); // Default to 1 since we only have one turf for now
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAvailability = async () => {
    if (!date) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/availability?date=${date}&turf_id=${turfId}`);
      const data = await res.json();
      if (res.ok) {
        setAvailableSlots(data.availableSlots);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [date]);

  const handleBook = async () => {
    if (!date || !selectedSlot) return alert('Please select a date and time slot');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ turf_id: turfId, date, time_slot: selectedSlot })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Booking successful!');
        navigate('/dashboard');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Book a Turf Slot</h2>
      
      <div className="form-group">
        <label>Select Date</label>
        <input 
          type="date" 
          value={date} 
          onChange={e => { setDate(e.target.value); setSelectedSlot(''); }} 
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {date && (
        <div style={{ marginTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Available Time Slots</label>
          {availableSlots.length === 0 ? (
            <p style={{ color: 'red' }}>No slots available for this date.</p>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  className={`btn ${selectedSlot === slot ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedSlot(slot)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '2rem' }}
        onClick={handleBook}
        disabled={!selectedSlot || loading}
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </div>
  );
}

export default Booking;
