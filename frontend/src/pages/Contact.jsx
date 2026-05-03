import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
  };

  return (
    <div className="section container">
      <h1 className="section-title">Contact Us</h1>
      
      <div className="grid grid-cols-2" style={{gap: '4rem', alignItems: 'start'}}>
        
        {/* Contact Info & Map */}
        <div>
          <div className="card" style={{marginBottom: '2rem'}}>
            <h2 style={{color: 'var(--primary)', marginBottom: '1.5rem'}}>Get in Touch</h2>
            <ul style={{listStyle: 'none', display: 'grid', gap: '1.5rem'}}>
              <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{background: 'var(--bg-alt)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)'}}>
                  <Phone size={24} />
                </div>
                <div>
                  <div style={{fontWeight: 600}}>Phone</div>
                  <div style={{color: 'var(--text-muted)'}}>01XXXXXXXXX</div>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{background: '#dcfce7', padding: '0.75rem', borderRadius: '50%', color: '#16a34a'}}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div style={{fontWeight: 600}}>WhatsApp</div>
                  <div style={{color: 'var(--text-muted)'}}>01XXXXXXXXX</div>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{background: '#dbeafe', padding: '0.75rem', borderRadius: '50%', color: '#2563eb', fontWeight: 'bold', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                  f
                </div>
                <div>
                  <div style={{fontWeight: 600}}>Facebook</div>
                  <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer" style={{color: 'var(--text-muted)'}}>facebook.com/yourpage</a>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{background: '#fee2e2', padding: '0.75rem', borderRadius: '50%', color: '#dc2626'}}>
                  <MapPin size={24} />
                </div>
                <div>
                  <div style={{fontWeight: 600}}>Address</div>
                  <div style={{color: 'var(--text-muted)'}}>Demra, Signboard, Dhaka</div>
                </div>
              </li>
            </ul>
          </div>

          <div style={{borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)'}}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14611.874135508822!2d90.4431945!3d23.7128509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b768c741e17d%3A0xc07ce9bcfcf629e4!2sDemra%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1689123456789!5m2!1sen!2sbd" 
              width="100%" 
              height="300" 
              style={{border: 0, display: 'block'}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Demra Turf Map"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{position: 'sticky', top: '100px'}}>
          <h2 style={{color: 'var(--primary)', marginBottom: '1.5rem'}}>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" required placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" required placeholder="01XXXXXXXXX" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="5" required placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{fontSize: '1.1rem', padding: '1rem'}}>
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;
