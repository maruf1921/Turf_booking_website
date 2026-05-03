import React from 'react';

function About() {
  return (
    <div className="section container">
      <h1 className="section-title">About Us</h1>
      
      <div style={{maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-muted)'}}>
        <p style={{marginBottom: '2rem', textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 500}}>
          We are Demra's premier football turf, located near Signboard. Our mission is to give everyone in the area a quality place to play football at an affordable price.
        </p>

        <div className="card" style={{padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-color)', borderRadius: '1rem', background: 'white'}}>
          <h2 style={{color: 'var(--primary)', marginBottom: '1.5rem'}}>Our Facilities</h2>
          <ul style={{listStyle: 'none', display: 'grid', gap: '1rem'}}>
            <li style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <span style={{color: 'var(--primary)'}}>✓</span> Professional artificial grass
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <span style={{color: 'var(--primary)'}}>✓</span> LED floodlights for night play
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <span style={{color: 'var(--primary)'}}>✓</span> Changing room and washroom
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <span style={{color: 'var(--primary)'}}>✓</span> Seating area for spectators
            </li>
            <li style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <span style={{color: 'var(--primary)'}}>✓</span> Secure parking
            </li>
          </ul>
        </div>

        <div>
          <h2 style={{color: 'var(--primary)', marginBottom: '1rem'}}>Our Story</h2>
          <p style={{marginBottom: '1rem'}}>
            Demra Turf Ground was established out of a deep love for football and a recognized need for high-quality sports infrastructure in our community. We noticed that local talent often struggled to find well-maintained, safe, and accessible grounds to practice and play competitive matches.
          </p>
          <p>
            Today, we are proud to serve hundreds of players—from passionate weekend warriors to local tournament teams. By providing top-tier artificial grass and reliable floodlights, we ensure that the game never has to stop, day or night. Our goal is to foster local talent, encourage physical fitness, and bring the community together through the beautiful game.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
