import React, { useState, useEffect } from 'react';

function Admin({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings/all', {
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

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') return <p>Access denied.</p>;

  return (
    <div>
      <h2>Admin Panel</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage all bookings and turf settings.</p>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '1rem' }}>All Bookings</h3>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem' }}>User</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem' }}>Slot</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div>{b.user_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.email}</div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{b.date}</td>
                  <td style={{ padding: '0.75rem' }}>{b.time_slot}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ color: b.status === 'confirmed' ? 'var(--primary)' : b.status === 'cancelled' ? 'red' : 'inherit' }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <select 
                      value={b.status} 
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '0.25rem', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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

export default Admin;
