import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';

function Dashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/bookings/my-bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (!user) return <p>Please login first.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Welcome, {user.name}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here are your bookings.</p>
        </div>
        <Link to="/book" className="btn btn-primary">Book New Slot</Link>
      </div>
      
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No bookings yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't booked any turf slots.</p>
          <Link to="/book" className="btn btn-outline">Make your first booking</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2">
          {bookings.map(b => (
            <div key={b.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{b.turf_name}</h3>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  backgroundColor: b.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: b.status === 'confirmed' ? 'var(--primary)' : '#ef4444'
                }}>
                  {b.status.toUpperCase()}
                </span>
              </div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MapPin size={16} color="var(--text-muted)" /> {b.location}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Calendar size={16} color="var(--text-muted)" /> {b.date}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--text-muted)" /> {b.time_slot}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
