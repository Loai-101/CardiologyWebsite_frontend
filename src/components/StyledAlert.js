import React from 'react';
import './StyledAlert.css';

const StyledAlert = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title, 
  message, 
  type = 'success',
  showIcon = true,
  showCancel = false,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getTypeClass = () => {
    return `styled-alert styled-alert-${type}`;
  };

  return (
    <div className="styled-alert-overlay" onClick={onClose}>
      <div className={getTypeClass()} onClick={(e) => e.stopPropagation()}>
        <div className="styled-alert-header">
          {showIcon && (
            <div className="styled-alert-icon">
              {getIcon()}
            </div>
          )}
          <h3 className="styled-alert-title">{title}</h3>
          <button 
            className="styled-alert-close" 
            onClick={onClose}
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
        
        <div className="styled-alert-body">
          <p className="styled-alert-message">{message}</p>
        </div>
        
        <div className="styled-alert-footer">
          {showCancel ? (
            <>
              <button 
                className="styled-alert-button styled-alert-button-secondary"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button 
                className="styled-alert-button styled-alert-button-primary"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button 
              className="styled-alert-button styled-alert-button-primary"
              onClick={onClose}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyledAlert;
