import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = async (id) => {
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.status === 200) {
        setBookings(bookings.map(b => b.id === id ? {...b, status: 'cancelled'} : b));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <div className="container section">Please login.</div>;

  return (
    <div className="section container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1 className="section-title" style={{marginBottom: '0', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            My Dashboard
            <button onClick={fetchBookings} className="btn btn-outline" style={{fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderColor: 'var(--primary)', color: 'var(--primary)'}}>Refresh</button>
          </h1>
          <p>Welcome back, {user.name} ({user.phone})</p>
        </div>
        <div className="card" style={{padding: '1rem', background: 'var(--bg-alt)', border: '1px solid var(--primary)'}}>
          <strong>Loyalty Points:</strong> {user.loyalty_points || 0}
        </div>
      </div>

      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <Link to="/booking" className="btn btn-primary">Book New Slot</Link>
        <button className="btn btn-outline" onClick={() => alert('Profile edit coming soon')}>Edit Profile</button>
      </div>

      <div className="card">
        <h2 style={{marginBottom: '1rem', color: 'var(--primary)'}}>My Bookings</h2>
        {loading ? <p>Loading...</p> : bookings.length === 0 ? <p>No bookings found.</p> : (
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                <th style={{padding: '0.75rem'}}>Date</th>
                <th style={{padding: '0.75rem'}}>Time</th>
                <th style={{padding: '0.75rem'}}>Status</th>
                <th style={{padding: '0.75rem'}}>Payment Status</th>
                <th style={{padding: '0.75rem'}}>Payment Method</th>
                <th style={{padding: '0.75rem'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                  <td style={{padding: '0.75rem'}}>{b.date}</td>
                  <td style={{padding: '0.75rem'}}>{b.time_slot} ({b.duration})</td>
                  <td style={{padding: '0.75rem'}}>
                    <span style={{color: b.status === 'confirmed' ? 'green' : b.status === 'rejected' ? 'red' : b.status === 'cancelled' ? 'gray' : 'orange', fontWeight: 'bold'}}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{padding: '0.75rem'}}>{b.payment_status}</td>
                  <td style={{padding: '0.75rem'}}>{b.payment_method || 'none'}</td>
                  <td style={{padding: '0.75rem'}}>
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button onClick={() => handleCancel(b.id)} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
