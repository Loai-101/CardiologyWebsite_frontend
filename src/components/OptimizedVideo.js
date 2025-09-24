import React, { useState, useRef, useEffect } from 'react';

const OptimizedVideo = ({ 
  src, 
  className = '', 
  poster = '',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoad = () => {},
  onError = () => {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      onLoad();
    };

    const handleError = () => {
      setHasError(true);
      onError();
    };

    // const handlePlay = () => setIsPlaying(true);
    // const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    // video.addEventListener('play', handlePlay);
    // video.addEventListener('pause', handlePause);

    // Preload the video
    video.preload = 'metadata';

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      // video.removeEventListener('play', handlePlay);
      // video.removeEventListener('pause', handlePause);
    };
  }, [onLoad, onError]);

  return (
    <div className={`optimized-video-container ${className}`}>
      {!isLoaded && !hasError && (
        <div className="video-loading-overlay">
          <div className="video-loading-spinner">
            <div className="spinner"></div>
            <span className="loading-text">Loading video...</span>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        poster={poster}
        className={`optimized-video ${isLoaded ? 'loaded' : ''}`}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {hasError && (
        <div className="video-error-overlay">
          <span>Failed to load video</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedVideo;
