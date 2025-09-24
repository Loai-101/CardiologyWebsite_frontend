import React, { useState, useEffect } from 'react';
import './Offers.css';
import apiService from '../../services/api';

const Offers = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sliderResponse, offersResponse] = await Promise.all([
        apiService.getSliderImages(),
        apiService.getOffers()
      ]);

      if (sliderResponse.success) {
        setSliderImages(sliderResponse.data);
      }

      if (offersResponse.success) {
        console.log('Offers loaded:', offersResponse.data);
        setOffers(offersResponse.data);
      }
    } catch (error) {
      console.error('Error loading offers data:', error);
      setError('Failed to load offers data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance slider
  useEffect(() => {
    if (sliderImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const formatPrice = (price) => {
    return `${price.toFixed(2)} BD`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      consultation: '🩺',
      treatment: '💊',
      package: '📦',
      checkup: '🔍',
      other: '⭐'
    };
    return icons[category] || '⭐';
  };

  if (loading) {
    return (
      <div className="offers-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-page">
        <div className="error-container">
          <h2>Error Loading Offers</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-page">

      {/* Slider Section */}
      {sliderImages.length > 0 && (
        <section className="slider-section">
          <div className="slider-container">
            <div className="slider-wrapper">
              {sliderImages.map((image, index) => (
                <div
                  key={image._id}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <div className="slide-image">
                    <img src={image.image} alt={image.title} />
                    <div className="slide-overlay">
                      <div className="slide-content">
                        <h2>{image.title}</h2>
                        {image.description && <p>{image.description}</p>}
                        {image.link && (
                          <a href={image.link} className="slide-button">
                            {image.buttonText}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation */}
            {sliderImages.length > 1 && (
              <>
                <button className="slider-nav prev" onClick={prevSlide}>
                  &#8249;
                </button>
                <button className="slider-nav next" onClick={nextSlide}>
                  &#8250;
                </button>

                {/* Dots Indicator */}
                <div className="slider-dots">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Offers Section */}
      <section className="offers-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Special Offers</h2>
            <p>Choose from our carefully curated healthcare packages</p>
          </div>

          {offers.length > 0 ? (
            <div className="offers-grid">
              {offers.map((offer) => (
                <div key={offer._id} className="offer-card">
                  <div className="offer-image">
                    {offer.image && offer.image.trim() !== '' ? (
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          e.target.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div className="image-fallback" style={{display: offer.image && offer.image.trim() !== '' ? 'none' : 'flex'}}>
                      <span className="fallback-icon">📷</span>
                      <span className="fallback-text">No Image</span>
                    </div>
                    {offer.discountPercentage > 0 && (
                      <div className="discount-badge">
                        -{offer.discountPercentage}%
                      </div>
                    )}
                    <div className="category-badge">
                      {getCategoryIcon(offer.category)} {offer.category}
                    </div>
                  </div>
                  
                  <div className="offer-content">
                    <h3>{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>
                    
                    {offer.features && offer.features.length > 0 && (
                      <ul className="offer-features">
                        {offer.features.map((feature, index) => (
                          <li key={index}>✓ {feature}</li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="offer-pricing">
                      <div className="price-container">
                        <span className="current-price">{formatPrice(offer.price)}</span>
                        {offer.originalPrice && offer.originalPrice > offer.price && (
                          <span className="original-price">{formatPrice(offer.originalPrice)}</span>
                        )}
                      </div>
                      {offer.validUntil && (
                        <p className="valid-until">
                          Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <button className="offer-button">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-offers">
              <h3>No offers available at the moment</h3>
              <p>Please check back later for new offers and packages.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Offers;
