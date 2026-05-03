import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Car, Box, ShieldCheck } from 'lucide-react';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Book Your Football Slot in Demra</h1>
          <p>Available 7AM to 11PM — Day & Night</p>
          <Link to="/booking" className="btn btn-primary" style={{fontSize: '1.25rem', padding: '1rem 2.5rem'}}>
            Book Now
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Our Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Daytime (7AM–5PM)</h3>
              <div className="price">৳2,000</div>
              <p className="text-muted">per 90 minutes</p>
            </div>
            <div className="pricing-card" style={{borderColor: 'var(--primary)', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontWeight: 800}}>Evening/Night (5PM–11PM)</h3>
              <div className="price">৳3,000</div>
              <p className="text-muted">per 90 minutes</p>
            </div>
            <div className="pricing-card">
              <h3>Friday/Holiday</h3>
              <div className="price">৳3,500</div>
              <p className="text-muted">per 90 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photos & Videos */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Turf Gallery</h2>
          <div className="photo-grid">
            <img src="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80" alt="Football Turf" />
            <img src="https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?w=800&q=80" alt="Action Shot" />
            <img src="https://images.unsplash.com/photo-1600133153574-25d98bf6b8ea?w=800&q=80" alt="Players" />
            <img src="https://images.unsplash.com/photo-1518605368461-1ee125225f27?w=800&q=80" alt="Ball on turf" />
            <img src="https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&q=80" alt="Team" />
            <img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80" alt="Stadium" />
          </div>
          
          <div className="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Match Highlight" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          
          <div className="text-center" style={{marginTop: '2rem'}}>
            <Link to="/gallery" className="btn btn-outline" style={{border: '2px solid var(--primary)', color: 'var(--primary)'}}>View Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section" style={{background: 'var(--bg-alt)'}}>
        <div className="container">
          <h2 className="section-title">Our Facilities</h2>
          <div className="facilities-grid">
            <div className="facility-item">
              <Lightbulb size={48} className="facility-icon" />
              <h3>LED Floodlights</h3>
            </div>
            <div className="facility-item">
              <Box size={48} className="facility-icon" />
              <h3>Changing Room</h3>
            </div>
            <div className="facility-item">
              <ShieldCheck size={48} className="facility-icon" />
              <h3>Washroom</h3>
            </div>
            <div className="facility-item">
              <Car size={48} className="facility-icon" />
              <h3>Parking Area</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What Players Say</h2>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Best turf in Demra area! The grass quality is amazing and the floodlights are very bright. Highly recommended."</p>
              <h4 style={{marginTop: '1rem'}}>- Rakib Hasan</h4>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Very clean and well maintained. The changing rooms and washrooms are a huge plus for our team."</p>
              <h4 style={{marginTop: '1rem'}}>- Mehedi Ahmed</h4>
            </div>
            <div className="review-card">
              <div className="stars">★★★★☆</div>
              <p>"Great environment to play with friends. Weekend prices are a bit high but totally worth the experience."</p>
              <h4 style={{marginTop: '1rem'}}>- Sakib Al Mamun</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section" style={{background: 'var(--bg-alt)'}}>
        <div className="container">
          <h2 className="section-title">Location</h2>
          <div style={{borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '1.5rem'}}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14611.874135508822!2d90.4431945!3d23.7128509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b768c741e17d%3A0xc07ce9bcfcf629e4!2sDemra%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1689123456789!5m2!1sen!2sbd" 
              width="100%" 
              height="450" 
              style={{border: 0, display: 'block'}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Demra Turf Map"
            ></iframe>
          </div>
          <p className="text-center" style={{fontSize: '1.25rem', fontWeight: 500}}>
            Demra, Signboard, Dhaka
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
