import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import './Loading.css';

const Loading = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start fade out animation after 2 seconds
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 2000);

    // Complete loading after animation
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete();
    }, 2300);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className={`loading-overlay ${isAnimating ? 'loading-fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <OptimizedImage 
            src="https://res.cloudinary.com/dvybb2xnc/image/upload/v1757918173/East-Kent-Cardiology-Logo-Design-Freelance-Graphic-Designer-Margate-Thanet-Kent_zhnxm4.webp" 
            alt="Cardiology Hospital Logo" 
            className="loading-logo-image"
            lazy={false}
          />
        </div>
        <h1 className="loading-title">Cardiology Hospital</h1>
      </div>
    </div>
  );
};

export default Loading;
