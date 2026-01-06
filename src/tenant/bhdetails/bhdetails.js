import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Home, UtensilsCrossed, Wind, Shirt, Shield, Droplet, Zap, BedDouble, Table2, Armchair } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './bhdetails.css';
import { auth, db } from '../../firebase/config';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadQRCode } from '../../services/cloudinaryService';

// Helper to send reservation email via backend /reserve endpoint
async function sendEmailToLandlord(landlordEmail, subject, html, reservationDetails) {
  try {
    // Compose payload for /reserve endpoint
    // Use formatAddress to ensure no object is sent
    function formatAddress(address) {
      if (!address) return '';
      if (typeof address === 'string') return address;
      if (typeof address === 'object') {
        const { streetSitio, barangay, cityMunicipality, province } = address;
        return [streetSitio, barangay, cityMunicipality, province].filter(Boolean).join(', ');
      }
      return '';
    }
    const payload = {
      tenant: {
        name: reservationDetails.tenantName,
        address: formatAddress(reservationDetails.tenantAddress),
        contactNumber: reservationDetails.tenantPhone,
        age: reservationDetails.tenantAge,
        status: reservationDetails.tenantStatus,
        birthdate: reservationDetails.tenantBirthdate,
        email: reservationDetails.tenantEmail || '',
      },
      reservedHouses: [
        {
          name: reservationDetails.boardingHouseName,
          address: formatAddress(reservationDetails.boardingHouseAddress),
        }
      ],
      paymentReference: reservationDetails.gcashRefNumber,
      landlordEmail: landlordEmail
    };
    const response = await fetch('http://localhost:5000/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send reservation email');
    return data;
  } catch (err) {
    console.warn('Reservation email send failed:', err);
  }
}

const BHDetails = ({ house, isOpen, onClose, likedHouses, onToggleLike }) => {
    // Helper to format address object to string
    function formatAddress(address) {
      if (!address) return '';
      if (typeof address === 'string') return address;
      if (typeof address === 'object') {
        // Join available address fields in order
        const { streetSitio, barangay, cityMunicipality, province } = address;
        return [streetSitio, barangay, cityMunicipality, province].filter(Boolean).join(', ');
      }
      return '';
    }
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReservationNotice, setShowReservationNotice] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Fetch landlord info and payment info
  useEffect(() => {
    const fetchLandlordInfo = async () => {
      const landlordUid = house?.landlordId || house?.landlordUid;
      console.log('[BHDetails] Fetching landlord info for house:', house);
      console.log('[BHDetails] Using landlordUid:', landlordUid);
      if (landlordUid) {
        try {
          const snap = await getDoc(doc(db, 'landlords', landlordUid));
          if (snap.exists()) {
            setLandlordInfo(snap.data());
            // Also try to get payment info
            const paymentSnap = await getDoc(doc(db, 'landlords', landlordUid, 'payment', 'info'));
            if (paymentSnap.exists()) {
              setPaymentInfo(paymentSnap.data());
              console.log('[BHDetails] Payment info fetched:', paymentSnap.data());
            } else {
              console.warn('[BHDetails] No payment info found for landlord:', landlordUid);
            }
          } else {
            console.warn('[BHDetails] No landlord doc found for:', landlordUid);
          }
        } catch (err) {
          console.warn('Could not fetch landlord info:', err);
        }
      } else {
        console.warn('[BHDetails] No landlordUid found in house:', house);
      }
    };
    if (isOpen && house) fetchLandlordInfo();
  }, [isOpen, house?.landlordId, house?.landlordUid]);
  
  // Normalize images into an array and reset index when house changes
  const images = (house && house.images && Array.isArray(house.images))
    ? house.images
    : (house && house.images ? [house.images] : []);
  
  // Detailed logging to diagnose image issues
  console.log('[BHDetails] Image normalization debug:', {
    houseId: house?.id,
    houseName: house?.name,
    rawImages: house?.images,
    rawImagesType: typeof house?.images,
    isArray: Array.isArray(house?.images),
    normalizedImages: images,
    normalizedLength: images.length,
    firstImage: images[0],
    allImages: JSON.stringify(images)
  });
  
  useEffect(() => {
    // Reset to first image when the house changes
    setCurrentImageIndex(0);
    console.log('[BHDetails] Reset carousel to index 0, available images:', images.length);
  }, [house?.id]);

  // Amenities configuration
  const amenityConfig = {
    wifi: { label: 'WiFi', icon: Wifi },
    comfortRoom: { label: 'Comfort Room', icon: Home },
    kitchen: { label: 'Kitchen', icon: UtensilsCrossed },
    ac: { label: 'AC', icon: Wind },
    laundry: { label: 'Laundry', icon: Shirt },
    security: { label: 'Security', icon: Shield },
    water: { label: 'Water', icon: Droplet },
    electricity: { label: 'Electricity', icon: Zap },
    bed: { label: 'Bed', icon: BedDouble },
    table: { label: 'Table', icon: Table2 },
    chair: { label: 'Chair', icon: Armchair }
  };

  // Get available amenities from house data
  const getAvailableAmenities = () => {
    if (!house.amenities) return [];
    
    return Object.entries(house.amenities)
      .filter(([key, value]) => value === true)
      .map(([key]) => ({
        key,
        label: amenityConfig[key]?.label || key,
        Icon: amenityConfig[key]?.icon || Home
      }));
  };

  // Initialize map when modal opens
  useEffect(() => {
    if (isOpen && house.location && mapRef.current && !mapInstanceRef.current) {
      // Fix for default marker icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map
      const map = L.map(mapRef.current).setView(
        [house.location.latitude, house.location.longitude],
        15
      );

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Add marker
      L.marker([house.location.latitude, house.location.longitude])
        .addTo(map)
        .bindPopup(`<b>${house.name}</b><br>${formatAddress(house.address)}`)
        .openPopup();

      mapInstanceRef.current = map;
    }

    // Cleanup map when modal closes
    return () => {
      if (!isOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, house]);

  if (!isOpen || !house) return null;

  console.log('BHDetails - house object:', {
    id: house.id,
    name: house.name,
    imagesType: typeof house.images,
    imagesLength: house.images?.length,
    images: house.images,
    hasImages: house.images && Array.isArray(house.images) && house.images.length > 0
  });

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextImage = () => {
    const imageCount = images.length;
    if (imageCount === 0) return;
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    const imageCount = images.length;
    if (imageCount === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onToggleLike(house.id);
  };

  const handleReserveClick = () => {
    // Check if house is available
    if (house.status === 'reserved') {
      alert('This boarding house is currently reserved. Please try again later.');
      return;
    }
    if (house.status === 'occupied') {
      alert('This boarding house is currently occupied. Please try again later.');
      return;
    }
    setShowReservationNotice(true);
  };

  const handleCloseReservationNotice = () => {
    setShowReservationNotice(false);
  };

  const handleProceed = () => {
    setShowReservationNotice(false);
    setShowPaymentForm(true);
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setReferenceNumber('');
    setQrCodeImage(null);
  };

  const handleQrCodeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Upload to Cloudinary using the landlord's UID if available
      const landlordUid = house?.landlordId || house?.landlordUid || 'tenant-qr';
      const qrUrl = await uploadQRCode(file, landlordUid);
      setQrCodeImage(qrUrl);
    } catch (err) {
      console.error('Error uploading QR code:', err);
      alert('Failed to upload QR code');
    }
  };

  const handleSubmitPayment = () => {
    if (!referenceNumber.trim()) {
      alert('Please enter a reference number');
      return;
    }

    (async () => {
      try {
        setShowPaymentForm(false);

        // Build reservation payload
        const user = auth.currentUser;
        const tenantUid = user ? user.uid : null;

        // Try to get tenant details to denormalize name/phone and other info
        let tenantName = user?.displayName || '';
        let tenantPhone = '';
        let tenantGender = '';
        let tenantBirthdate = '';
        let tenantAge = '';
        let tenantStatus = '';
        let tenantAddress = '';
        if (tenantUid) {
          try {
            const tenantSnap = await getDoc(doc(db, 'tenants', tenantUid));
            if (tenantSnap.exists()) {
              const t = tenantSnap.data();
              tenantName = `${t.firstName || ''} ${t.middleName || ''} ${t.lastName || ''}`.trim();
              tenantPhone = t.mobileNumber || '';
              tenantGender = t.gender || '';
              tenantBirthdate = t.dateOfBirth || '';
              tenantStatus = t.civilStatus || '';
              tenantAddress = t.permanentAddress || '';
              // Calculate age from birthdate
              if (tenantBirthdate) {
                const birthDate = new Date(tenantBirthdate);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                tenantAge = age.toString();
              }
            }
          } catch (err) {
            console.warn('Could not fetch tenant doc:', err);
          }
        }

        const reservation = {
          tenantUid: tenantUid,
          tenantName: tenantName || tenantUid || 'Guest',
          tenantPhone: tenantPhone || '',
          tenantGender: tenantGender || '',
          tenantBirthdate: tenantBirthdate || '',
          tenantAge: tenantAge || '',
          tenantStatus: tenantStatus || '',
          tenantAddress: formatAddress(tenantAddress),
          boardingHouseId: house.id || null,
          boardingHouseName: house.name || '',
          boardingHouseAddress: formatAddress(house.address),
          landlordUid: house.landlordId || house.landlordUid || null,
          roomType: house.type || house.roomType || '',
          price: house.price || '',
          gcashRefNumber: referenceNumber.trim(),
          qrCodeImage: qrCodeImage || null,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        try {
          // Update boarding house status to reserved
          const houseRef = doc(db, 'Boardinghouse', house.id);
          await updateDoc(houseRef, { status: 'reserved' });

          await addDoc(collection(db, 'reservations'), reservation);
          console.log('Reservation saved:', reservation);

          // Send email to landlord if email is available
          if (landlordInfo && landlordInfo.email) {
            const subject = 'New Reservation Notification';
            const html = `
              <p>Hello,</p>
              <p>A new reservation has been made for your property: <b>${house.name}</b>.</p>
              <h3>Tenant Details:</h3>
              <ul>
                <li><b>Name:</b> ${tenantName}</li>
                <li><b>Contact Number:</b> ${tenantPhone}</li>
                <li><b>Address:</b> ${formatAddress(tenantAddress)}</li>
                <li><b>Email:</b> ${user?.email || ''}</li>
                <li><b>Age:</b> ${tenantAge}</li>
                <li><b>Date of Birth:</b> ${tenantBirthdate}</li>
              </ul>
              <h3>Reservation Details:</h3>
              <ul>
                <li><b>Boarding House:</b> ${house.name}</li>
                <li><b>Address:</b> ${formatAddress(house.address)}</li>
                <li><b>GCash Reference Number:</b> ${referenceNumber.trim()}</li>
              </ul>
              <p>Please check your dashboard for more details.</p>
            `;
            sendEmailToLandlord(landlordInfo.email, subject, html, {
              tenantName,
              tenantAddress: formatAddress(tenantAddress),
              tenantPhone,
              tenantAge,
              tenantStatus,
              tenantBirthdate,
              tenantEmail: user?.email || '',
              boardingHouseName: house.name,
              boardingHouseAddress: formatAddress(house.address),
              gcashRefNumber: referenceNumber.trim(),
            });
          }
        } catch (err) {
          console.error('Failed to save reservation:', err);
        }

        // Show success animation
        setShowSuccessAnimation(true);

        setTimeout(() => {
          setShowSuccessAnimation(false);
          setReferenceNumber('');
          setQrCodeImage(null);
        }, 3000);
      } catch (err) {
        console.error('Payment submit error:', err);
        alert('Failed to submit payment. Please try again.');
      }
    })();
  };

  const availableAmenities = getAvailableAmenities();

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-left">
            <button className="back-button" onClick={onClose}>
              ←
            </button>
            
            <div className="image-carousel">
              <img
                key={`img-${currentImageIndex}`}
                src={images[currentImageIndex] || '/default.png'}
                alt={house.name}
                onLoad={() => {
                  console.log(`[BHDetails] Image loaded at index ${currentImageIndex}:`, images[currentImageIndex]);
                }}
                onError={(e) => {
                  console.error(`[BHDetails] Image failed to load at index ${currentImageIndex}:`, {
                    attemptedUrl: e.target.src,
                    currentIndex: currentImageIndex,
                    totalImages: images.length,
                    allImages: images
                  });
                  e.target.src = '/default.png';
                }}
              />
              {images.length > 1 && (
                <>
                  <button className="carousel-nav prev" onClick={prevImage}>
                    &lt;
                  </button>
                  <button className="carousel-nav next" onClick={nextImage}>
                    &gt;
                  </button>
                </>
              )}
              <div className="carousel-dots">
                {images.map((imgUrl, index) => (
                  <span 
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                    title={`Image ${index + 1}: ${imgUrl ? imgUrl.substring(0, 40) : 'empty'}`}
                  />
                ))}
              </div>
            </div>

            <div className="modal-details">
              <div className="title-section">
                <h1>{house.name}</h1>
                <button 
                  className={`like-button-modal ${likedHouses && likedHouses.has(house.id) ? 'liked' : ''}`}
                  onClick={handleLikeClick}
                >
                  {likedHouses && likedHouses.has(house.id) ? '♥' : '♡'}
                </button>
              </div>

              <div className="location-section">
                <svg className="location-pin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{formatAddress(house.address)}</span>
              </div>

              <div className="room-price-section">
                <p className="room-type-text">{house.type}</p>
                <p className="price">₱{parseFloat(house.price).toLocaleString()}/month</p>
              </div>

              {/* Map Container */}
              <div className="map-placeholder">
                <div 
                  ref={mapRef} 
                  className="map-container" 
                  style={{ height: '300px', width: '100%', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="contact-section">
                <h3>For more information please contact:</h3>
                <div className="contact-info">
                  <div className="contact-avatar">
                    <img 
                      src={landlordInfo?.profileImage || '/default.png'}
                      alt="Landlord"
                      onError={(e) => {
                        e.target.src = '/default.png';
                      }}
                    />
                  </div>
                  <div className="contact-details">
                    <h4>{`${landlordInfo?.firstName || ''} ${landlordInfo?.lastName || ''}`.trim() || 'Landlord'}</h4>
                    <p>
                      <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                      </svg>
                      {landlordInfo?.contactNumber || 'Contact via reservation'}
                    </p>
                    <p>
                      <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {(() => {
                        const addr = landlordInfo?.boardingHouseAddress ? landlordInfo.boardingHouseAddress : house.address;
                        console.log('[BHDetails] Rendering address in contact section:', addr, 'Type:', typeof addr);
                        if (typeof addr === 'object' || typeof addr === 'string') {
                          return formatAddress(addr);
                        }
                        return '';
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-right">
            <div className="description-section">
              <h2>Description</h2>
              <p>{house.description}</p>
              
              {/* Available Amenities */}
              {availableAmenities.length > 0 && (
                <React.Fragment>
                  <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Available Amenities</h3>
                  <div className="amenities-grid">
                    {availableAmenities.map(({ key, label, Icon }) => (
                      <div key={key} className="amenity-item">
                        <Icon size={20} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
            
            <button className="reserve-button" onClick={handleReserveClick}>
              Reserve now
            </button>
          </div>
        </div>

        {/* Reservation Notice Modal */}
        {showReservationNotice && (
          <div className="reservation-overlay" onClick={handleCloseReservationNotice}>
            <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-reservation-btn" onClick={handleCloseReservationNotice}>
                ×
              </button>
              <h2>Reservation Notice!</h2>
              <div className="reservation-content">
                <p>
                  A <strong>₱50</strong> reservation fee is required to confirm your reservation.
                </p>
                <p>
                  After reserving, you must contact the landlord or visit the location within <strong>24 hours</strong>.
                </p>
                <p>
                  If no contact or visit is made within 24 hours, your reservation will be considered <strong>void</strong>, and the room may be offered to others.
                </p>
              </div>
              <button className="proceed-button" onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="reservation-overlay" onClick={handleClosePaymentForm}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-reservation-btn" onClick={handleClosePaymentForm}>
                ×
              </button>
              <h2>Payment Details</h2>
              <div className="payment-content">
                <div className="qr-gcash-row">
                  <div className="qr-upload-container">
                    <img src="/50.jpg" alt="QR Code" className="qr-code-image" />
                  </div>
                  <div className="gcash-details">
                    <div className="payment-method">
                      <img src="/GCash.png" alt="GCash Logo" style={{ height: 56, marginRight: 12 }} />
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <label style={{ fontWeight: 'bold', fontSize: 13 }}>Account Name</label>
                      <p className="account-name" style={{ margin: 0 }}>RENT EASY</p>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ fontWeight: 'bold', fontSize: 13 }}>Gcash Number</label>
                      <p className="mobile-number" style={{ margin: 0 }}>09158706048</p>
                    </div>
                    <div className="reference-section reference-under-mobile">
                      <label htmlFor="reference-number">Reference Number</label>
                      <input
                        id="reference-number"
                        type="text"
                        className="reference-input"
                        placeholder="Enter reference number"
                        value={referenceNumber}
                        maxLength={15}
                        style={{ border: 'none', borderBottom: '1px solid #ccc', outline: 'none', background: 'transparent', fontSize: 16, width: '100%', boxShadow: 'none' }}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                          setReferenceNumber(val);
                        }}
                      />
                    </div>
                    <button className="submit-button" onClick={handleSubmitPayment}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Animation */}
        {showSuccessAnimation && (
          <div className="success-overlay">
            <div className="success-animation">
              <div className="checkmark-circle">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <h2>Payment Submitted!</h2>
              <p>Your reservation is being processed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BHDetails;