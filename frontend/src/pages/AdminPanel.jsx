import React, { useState, useEffect } from 'react';

function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ todayBookings: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  // Slot config state
  const [pricing, setPricing] = useState({ day_price: 2000, evening_price: 3000, friday_price: 3500, discount_percentage: 0 });
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [resStats, resBookings, resCust, resConfig] = await Promise.all([
        fetch('http://localhost:5000/api/bookings/stats', { headers }),
        fetch('http://localhost:5000/api/bookings/all', { headers }),
        fetch('http://localhost:5000/api/bookings/customers', { headers }),
        fetch('http://localhost:5000/api/bookings/config', { headers })
      ]);
      setStats(await resStats.json());
      setBookings(await resBookings.json());
      setCustomers(await resCust.json());
      
      const config = await resConfig.json();
      if (config.turf) {
        setPricing({
          day_price: config.turf.day_price,
          evening_price: config.turf.evening_price,
          friday_price: config.turf.friday_price,
          discount_percentage: config.turf.discount_percentage
        });
      }
      setBlockedDates(config.blockedDates || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchData();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePaymentField = async (id, field, value, currentBooking) => {
    const payload = {
        payment_status: currentBooking.payment_status,
        payment_method: currentBooking.payment_method,
        [field]: value
    };
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePricingUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/bookings/pricing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(pricing)
      });
      alert('Pricing updated successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    if (!newBlockDate) return;
    try {
      await fetch(`http://localhost:5000/api/bookings/block-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ date: newBlockDate, reason: blockReason })
      });
      setNewBlockDate('');
      setBlockReason('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnblockDate = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/block-date/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') return <div className="container section">Access Denied.</div>;

  return (
    <div className="section container">
      <h1 className="section-title" style={{textAlign: 'left'}}>Admin System Management</h1>
      
      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
        <button className={`btn ${activeTab === 'slots' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('slots')}>Slot Management</button>
        <button className={`btn ${activeTab === 'customers' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('customers')}>Customers</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-2">
          <div className="card">
            <h3>Today's Bookings</h3>
            <p style={{fontSize: '3rem', fontWeight: 800, color: 'var(--primary)'}}>{stats.todayBookings}</p>
          </div>
          <div className="card">
            <h3>Total Revenue (Paid)</h3>
            <p style={{fontSize: '3rem', fontWeight: 800, color: 'var(--primary)'}}>৳{stats.revenue}</p>
          </div>
          <div className="card">
            <h3>Notifications</h3>
            <p>{bookings.filter(b => b.status === 'pending').length} new booking requests pending approval.</p>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="card" style={{overflowX: 'auto'}}>
          <h3 style={{marginBottom: '1rem'}}>All Bookings</h3>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                <th style={{padding: '0.75rem'}}>User</th>
                <th style={{padding: '0.75rem'}}>Date/Time</th>
                <th style={{padding: '0.75rem'}}>Price (bKash)</th>
                <th style={{padding: '0.75rem'}}>Booking Status</th>
                <th style={{padding: '0.75rem'}}>Payment Status & Method</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                  <td style={{padding: '0.75rem'}}>{b.name}<br/><small>{b.phone}</small></td>
                  <td style={{padding: '0.75rem'}}>{b.date} <br/> {b.time_slot} ({b.duration})</td>
                  <td style={{padding: '0.75rem'}}>৳{b.price} <br/><small>{b.bkash_number || 'N/A'}</small></td>
                  <td style={{padding: '0.75rem'}}>
                    <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{padding: '0.75rem'}}>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <select value={b.payment_status} onChange={(e) => updatePaymentField(b.id, 'payment_status', e.target.value, b)}>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                      <select value={b.payment_method || 'none'} onChange={(e) => updatePaymentField(b.id, 'payment_method', e.target.value, b)}>
                        <option value="none">Method...</option>
                        <option value="bKash">bKash</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="grid grid-cols-2" style={{gap: '2rem'}}>
          <div className="card">
            <h3 style={{marginBottom: '1rem', color: 'var(--primary)'}}>Update Pricing & Offers</h3>
            <form onSubmit={handlePricingUpdate}>
              <div className="form-group">
                <label>Daytime Price (7AM–5PM)</label>
                <input type="number" value={pricing.day_price} onChange={e => setPricing({...pricing, day_price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Evening Price (5PM–11PM)</label>
                <input type="number" value={pricing.evening_price} onChange={e => setPricing({...pricing, evening_price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Friday/Holiday Price</label>
                <input type="number" value={pricing.friday_price} onChange={e => setPricing({...pricing, friday_price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Special Discount Percentage (%)</label>
                <input type="number" value={pricing.discount_percentage} onChange={e => setPricing({...pricing, discount_percentage: e.target.value})} required min="0" max="100" />
              </div>
              <button className="btn btn-primary btn-block">Save Pricing</button>
            </form>
          </div>

          <div className="card">
            <h3 style={{marginBottom: '1rem', color: 'var(--primary)'}}>Block Dates (e.g., Eid/Maintenance)</h3>
            <form onSubmit={handleBlockDate} style={{marginBottom: '2rem'}}>
              <div className="form-group">
                <label>Select Date</label>
                <input type="date" value={newBlockDate} onChange={e => setNewBlockDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input type="text" value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="e.g., Eid Holiday" required />
              </div>
              <button className="btn btn-outline btn-block" style={{borderColor: 'red', color: 'red'}}>Block Date</button>
            </form>

            <h4>Currently Blocked Dates</h4>
            {blockedDates.length === 0 ? <p className="text-muted">No blocked dates.</p> : (
              <ul style={{listStyle: 'none', padding: 0, marginTop: '1rem'}}>
                {blockedDates.map(b => (
                  <li key={b.id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-alt)', marginBottom: '0.5rem', borderRadius: '0.5rem'}}>
                    <span><strong>{b.date}</strong> - {b.reason}</span>
                    <button onClick={() => handleUnblockDate(b.id)} style={{color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer'}}>Unblock</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="card" style={{overflowX: 'auto'}}>
          <h3 style={{marginBottom: '1rem'}}>Customer Management</h3>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                <th style={{padding: '0.75rem'}}>Name</th>
                <th style={{padding: '0.75rem'}}>Phone</th>
                <th style={{padding: '0.75rem'}}>Total Bookings</th>
                <th style={{padding: '0.75rem'}}>Loyalty Points</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                  <td style={{padding: '0.75rem'}}>{c.name}</td>
                  <td style={{padding: '0.75rem'}}>{c.phone}</td>
                  <td style={{padding: '0.75rem'}}>{c.total_bookings}</td>
                  <td style={{padding: '0.75rem'}}>{c.loyalty_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
