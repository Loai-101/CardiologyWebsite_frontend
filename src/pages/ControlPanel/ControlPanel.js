import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import StyledAlert from '../../components/StyledAlert';
import './ControlPanel.css';

const ControlPanel = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('offers');
  const [offers, setOffers] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAddSliderModal, setShowAddSliderModal] = useState(false);
  const [offerFormData, setOfferFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'consultation',
    features: [],
    termsAndConditions: ''
  });
  const [sliderFormData, setSliderFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    order: 1
  });

  const showAlertMessage = useCallback((title, message, type) => {
    setAlertData({ title, message, type });
    setShowAlert(true);
  }, []);

  // Calculate offer statistics
  const getOfferStats = useCallback(() => {
    const totalOffers = offers.length;
    const activeOffers = offers.filter(offer => offer.isActive).length;
    const inactiveOffers = totalOffers - activeOffers;
    const totalValue = offers.reduce((sum, offer) => sum + (offer.price || 0), 0);
    const averagePrice = totalOffers > 0 ? totalValue / totalOffers : 0;

    return {
      total: totalOffers,
      active: activeOffers,
      inactive: inactiveOffers,
      totalValue: totalValue,
      averagePrice: averagePrice
    };
  }, [offers]);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllOffers();
      if (response.success) {
        setOffers(response.data);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
      showAlertMessage('Error', 'Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlertMessage]);

  const loadSliderImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllSliderImages();
      if (response.success) {
        setSliderImages(response.data);
      }
    } catch (error) {
      console.error('Error loading slider images:', error);
      showAlertMessage('Error', 'Failed to load slider images', 'error');
    } finally {
      setLoading(false);
    }
  }, [showAlertMessage]);

  useEffect(() => {
    if (activeTab === 'offers') {
      loadOffers();
    } else if (activeTab === 'slider') {
      loadSliderImages();
    }
  }, [activeTab, loadOffers, loadSliderImages]);

  // Redirect if not admin
  if (!isAuthenticated || !isAdmin) {
    navigate('/');
    return null;
  }

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertData({});
  };

  const handleOfferInputChange = (e) => {
    const { name, value } = e.target;
    setOfferFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderInputChange = (e) => {
    const { name, value } = e.target;
    setSliderFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOffer = () => {
    setShowAddOfferModal(true);
    setOfferFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'consultation',
      features: [],
      termsAndConditions: ''
    });
  };

  const handleCloseAddOfferModal = () => {
    setShowAddOfferModal(false);
    setOfferFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'consultation',
      features: [],
      termsAndConditions: ''
    });
  };

  const handleAddSlider = () => {
    setShowAddSliderModal(true);
    setSliderFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      order: sliderImages.length + 1
    });
  };

  const handleCloseAddSliderModal = () => {
    setShowAddSliderModal(false);
    setSliderFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      order: 1
    });
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!offerFormData.title.trim()) {
      showAlertMessage('Error', 'Please enter an offer title', 'error');
      return;
    }
    if (!offerFormData.description.trim()) {
      showAlertMessage('Error', 'Please enter an offer description', 'error');
      return;
    }
    if (!offerFormData.price || parseFloat(offerFormData.price) <= 0) {
      showAlertMessage('Error', 'Please enter a valid price', 'error');
      return;
    }
    if (!offerFormData.image.trim()) {
      showAlertMessage('Error', 'Please enter an image URL', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert price to number and prepare data
      const offerData = {
        ...offerFormData,
        price: parseFloat(offerFormData.price),
        originalPrice: offerFormData.originalPrice ? parseFloat(offerFormData.originalPrice) : undefined
      };
      
      console.log('Sending offer data:', offerData);
      const response = await apiService.createOffer(offerData);
      
      if (response.success) {
        showAlertMessage('Success', 'Offer created successfully', 'success');
        handleCloseAddOfferModal();
        loadOffers();
      } else {
        console.error('API Error Response:', response);
        showAlertMessage('Error', response.message || 'Failed to create offer', 'error');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      console.error('Error details:', error.message);
      showAlertMessage('Error', `Failed to create offer: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSlider = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!sliderFormData.title.trim()) {
      showAlertMessage('Error', 'Please enter a slider title', 'error');
      return;
    }
    if (!sliderFormData.imageUrl.trim()) {
      showAlertMessage('Error', 'Please enter an image URL', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      const sliderData = {
        title: sliderFormData.title,
        description: sliderFormData.description,
        image: sliderFormData.imageUrl, // Map imageUrl to image for backend
        link: sliderFormData.link,
        order: parseInt(sliderFormData.order) || 1
      };
      
      console.log('Sending slider data:', sliderData);
      const response = await apiService.createSliderImage(sliderData);
      
      if (response.success) {
        showAlertMessage('Success', 'Slider image created successfully', 'success');
        handleCloseAddSliderModal();
        loadSliderImages();
      } else {
        console.error('API Error Response:', response);
        let errorMessage = response.message || 'Failed to create slider image';
        
        // Show specific validation errors if available
        if (response.errors && response.errors.length > 0) {
          const validationErrors = response.errors.map(err => err.msg).join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        }
        
        showAlertMessage('Error', errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error creating slider image:', error);
      console.error('Error details:', error.message);
      showAlertMessage('Error', `Failed to create slider image: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    try {
      await apiService.deleteOffer(offerId);
      showAlertMessage('Success', 'Offer deleted successfully', 'success');
      loadOffers();
    } catch (error) {
      showAlertMessage('Error', 'Failed to delete offer', 'error');
    }
  };

  const handleDeleteSliderImage = async (sliderId) => {
    try {
      await apiService.deleteSliderImage(sliderId);
      showAlertMessage('Success', 'Slider image deleted successfully', 'success');
      loadSliderImages();
    } catch (error) {
      showAlertMessage('Error', 'Failed to delete slider image', 'error');
    }
  };

  const toggleOfferStatus = async (offerId, currentStatus) => {
    try {
      await apiService.updateOffer(offerId, { isActive: !currentStatus });
      showAlertMessage('Success', 'Offer status updated successfully', 'success');
      loadOffers();
    } catch (error) {
      showAlertMessage('Error', 'Failed to update offer status', 'error');
    }
  };

  const toggleSliderStatus = async (sliderId, currentStatus) => {
    try {
      await apiService.updateSliderImage(sliderId, { isActive: !currentStatus });
      showAlertMessage('Success', 'Slider image status updated successfully', 'success');
      loadSliderImages();
    } catch (error) {
      showAlertMessage('Error', 'Failed to update slider image status', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="control-panel-page">
      <div className="control-panel-container">
        <div className="control-panel-header">
          <h1 className="control-panel-title">Control Panel</h1>
          <p className="control-panel-subtitle">
            Administrative control center for Cardiology Hospital
          </p>
        </div>

        <div className="control-panel-content">
          {/* Navigation Tabs */}
          <div className="control-panel-tabs">
            <button 
              className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              📦 Offers Management
            </button>
            <button 
              className={`tab-button ${activeTab === 'slider' ? 'active' : ''}`}
              onClick={() => setActiveTab('slider')}
            >
              🖼️ Slider Management
            </button>
          </div>

          {/* Offers Management Tab */}
          {activeTab === 'offers' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Offers Management</h2>
                <button 
                  className="add-button"
                  onClick={handleAddOffer}
                >
                  ➕ Add New Offer
                </button>
              </div>

              {/* Offers Dashboard */}
              <div className="offers-dashboard">
                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <div className="card-icon">📦</div>
                    <div className="card-info">
                      <div className="card-number">{getOfferStats().total}</div>
                      <div className="card-label">Total Offers</div>
                    </div>
                  </div>
                  <div className="dashboard-card">
                    <div className="card-icon">✅</div>
                    <div className="card-info">
                      <div className="card-number">{getOfferStats().active}</div>
                      <div className="card-label">Active</div>
                    </div>
                  </div>
                  <div className="dashboard-card">
                    <div className="card-icon">⏸️</div>
                    <div className="card-info">
                      <div className="card-number">{getOfferStats().inactive}</div>
                      <div className="card-label">Inactive</div>
                    </div>
                  </div>
                  <div className="dashboard-card">
                    <div className="card-icon">💰</div>
                    <div className="card-info">
                      <div className="card-number">{getOfferStats().averagePrice.toFixed(0)} BD</div>
                      <div className="card-label">Avg Price</div>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading offers...</p>
                </div>
              ) : (
                <div className="offers-grid">
                  {offers.map((offer) => (
                    <div key={offer._id} className="offer-management-card">
                      <div className="offer-image">
                        <img src={offer.image} alt={offer.title} />
                        <div className={`status-badge ${offer.isActive ? 'active' : 'inactive'}`}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="offer-details">
                        <h3>{offer.title}</h3>
                        <p className="offer-description">{offer.description}</p>
                        <div className="offer-pricing">
                          <span className="price">{offer.price.toFixed(2)} BD</span>
                          {offer.originalPrice && (
                            <span className="original-price">{offer.originalPrice.toFixed(2)} BD</span>
                          )}
                        </div>
                        <div className="offer-actions">
                          <button 
                            className={`status-button ${offer.isActive ? 'deactivate' : 'activate'}`}
                            onClick={() => toggleOfferStatus(offer._id, offer.isActive)}
                          >
                            {offer.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            className="edit-button"
                            onClick={() => navigate('/offers')}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteOffer(offer._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Slider Management Tab */}
          {activeTab === 'slider' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Slider Management</h2>
                <button 
                  className="add-button"
                  onClick={handleAddSlider}
                >
                  ➕ Add New Slider Image
                </button>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading slider images...</p>
                </div>
              ) : (
                <div className="slider-grid">
                  {sliderImages.map((image) => (
                    <div key={image._id} className="slider-management-card">
                      <div className="slider-image">
                        <img src={image.image} alt={image.title} />
                        <div className={`status-badge ${image.isActive ? 'active' : 'inactive'}`}>
                          {image.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="slider-details">
                        <h3>{image.title}</h3>
                        {image.description && <p>{image.description}</p>}
                        <div className="slider-actions">
                          <button 
                            className={`status-button ${image.isActive ? 'deactivate' : 'activate'}`}
                            onClick={() => toggleSliderStatus(image._id, image.isActive)}
                          >
                            {image.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            className="edit-button"
                            onClick={() => navigate('/offers')}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteSliderImage(image._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          <div className="control-panel-actions">
            <button
              onClick={() => navigate('/admin')}
              className="control-panel-button control-panel-button-primary"
            >
              🏥 Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="control-panel-button control-panel-button-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Add Offer Modal */}
      {showAddOfferModal && (
        <div className="modal-overlay" onClick={handleCloseAddOfferModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Offer</h3>
              <button 
                className="modal-close"
                onClick={handleCloseAddOfferModal}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitOffer} className="modal-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Offer Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={offerFormData.title}
                  onChange={handleOfferInputChange}
                  className="form-input"
                  required
                  placeholder="Enter offer title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={offerFormData.description}
                  onChange={handleOfferInputChange}
                  className="form-textarea"
                  required
                  rows="4"
                  placeholder="Enter offer description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">Current Price (BD) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={offerFormData.price}
                    onChange={handleOfferInputChange}
                    className="form-input"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="originalPrice" className="form-label">Original Price (BD)</label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={offerFormData.originalPrice}
                    onChange={handleOfferInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">Image URL *</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={offerFormData.image}
                  onChange={handleOfferInputChange}
                  className="form-input"
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  name="category"
                  value={offerFormData.category}
                  onChange={handleOfferInputChange}
                  className="form-select"
                >
                  <option value="consultation">Consultation</option>
                  <option value="treatment">Treatment</option>
                  <option value="package">Package</option>
                  <option value="checkup">Checkup</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="termsAndConditions" className="form-label">Terms & Conditions</label>
                <textarea
                  id="termsAndConditions"
                  name="termsAndConditions"
                  value={offerFormData.termsAndConditions}
                  onChange={handleOfferInputChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Enter terms and conditions"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseAddOfferModal}
                  className="modal-button modal-button-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-button modal-button-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Slider Modal */}
      {showAddSliderModal && (
        <div className="modal-overlay" onClick={handleCloseAddSliderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Slider Image</h3>
              <button 
                className="modal-close"
                onClick={handleCloseAddSliderModal}
                title="Close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitSlider} className="modal-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Slider Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={sliderFormData.title}
                  onChange={handleSliderInputChange}
                  className="form-input"
                  required
                  placeholder="Enter slider title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={sliderFormData.description}
                  onChange={handleSliderInputChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Enter slider description (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl" className="form-label">Image URL *</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={sliderFormData.imageUrl}
                  onChange={handleSliderInputChange}
                  className="form-input"
                  required
                  placeholder="https://example.com/slider-image.jpg"
                />
              </div>

              <div className="form-group">
                <label htmlFor="link" className="form-label">Link URL</label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={sliderFormData.link}
                  onChange={handleSliderInputChange}
                  className="form-input"
                  placeholder="https://example.com (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="order" className="form-label">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={sliderFormData.order}
                  onChange={handleSliderInputChange}
                  className="form-input"
                  min="1"
                  placeholder="1"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseAddSliderModal}
                  className="modal-button modal-button-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-button modal-button-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Slider Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <StyledAlert
        isOpen={showAlert}
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        onClose={handleCloseAlert}
      />
    </div>
  );
};

export default ControlPanel;