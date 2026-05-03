import React from 'react';

function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80",
    "https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?w=800&q=80",
    "https://images.unsplash.com/photo-1600133153574-25d98bf6b8ea?w=800&q=80",
    "https://images.unsplash.com/photo-1518605368461-1ee125225f27?w=800&q=80",
    "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&q=80",
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
  ];

  return (
    <div className="section container">
      <h1 className="section-title">Photos and Videos</h1>
      
      <div className="photo-grid" style={{marginBottom: '4rem'}}>
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`Turf ground view ${idx + 1}`} loading="lazy" />
        ))}
      </div>

      <h2 style={{textAlign: 'center', marginBottom: '2rem', color: 'var(--text-main)'}}>Match Highlights</h2>
      <div className="video-container" style={{maxWidth: '800px', margin: '0 auto'}}>
        <iframe 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          title="Match Highlight" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen>
        </iframe>
      </div>
    </div>
  );
}

export default Gallery;
