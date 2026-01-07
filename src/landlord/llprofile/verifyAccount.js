import React, { useRef, useState, useEffect } from 'react';
import './verifyAccount.css';

const VALID_PH_IDS = [
  'Philippine Passport',
  'Driver’s License',
  'SSS ID',
  'GSIS e-Card',
  'PRC ID',
  'OWWA ID',
  'OFW ID',
  'Voter’s ID',
  'Postal ID',
  'PhilHealth ID',
  'Senior Citizen ID',
  'PWD ID',
  'Unified Multi-Purpose ID (UMID)',
  'National ID (PhilSys)',
  'TIN ID',
  'Barangay Certification',
];

const VerifyAccount = ({ onSubmit, onClose }) => {

    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedId, setSelectedId] = useState('');
    const [frontImage, setFrontImage] = useState(null); // preview URL
    const [frontFile, setFrontFile] = useState(null); // actual File
    const [backImage, setBackImage] = useState(null); // preview URL
    const [backFile, setBackFile] = useState(null); // actual File
    const [referenceNumber, setReferenceNumber] = useState('');
    const [idMethod, setIdMethod] = useState('upload');
    const frontInputRef = useRef();
    const backInputRef = useRef();

  // Modal auto-close and redirect logic (must be inside component, after useState)
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        window.location.href = '/llhome';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const handleFrontImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFrontFile(e.target.files[0]);
      setFrontImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleBackImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBackFile(e.target.files[0]);
      setBackImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleSubmitId = (e) => {
    e.preventDefault();
    if (!selectedId || !frontImage || !backImage) return;
    setStep(2);
  };
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setShowModal(true);
    if (onSubmit) onSubmit({ selectedId, frontImage, backImage, referenceNumber, frontFile, backFile });
  };

  return (
    <>
      <div className="verify-blur-bg" />
      {step === 1 && (
        <div className="verify-modal" style={{marginTop: '80px'}}>
          <button className="modal-close-x" type="button" onClick={onClose}>&#10005;</button>
          <h2>Verify Account</h2>
          <form onSubmit={handleSubmitId}>
            <div className="id-list-section">
              <label htmlFor="valid-id">Select Valid ID:</label>
              <select
                id="valid-id"
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                required
              >
                <option value="">-- Choose ID --</option>
                {VALID_PH_IDS.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
            <div className="id-upload-row">
              <div className="id-upload-section">
                <label>Upload Front of ID:</label>
                <div className="id-methods">
                  <button type="button" onClick={() => frontInputRef.current.click()}>Upload Photo</button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={frontInputRef}
                  onChange={handleFrontImageChange}
                />
                {frontImage && <img src={frontImage} alt="Front ID Preview" className="id-preview" />}
              </div>
              <div className="id-upload-section">
                <label>Upload Back of ID:</label>
                <div className="id-methods">
                  <button type="button" onClick={() => backInputRef.current.click()}>Upload Photo</button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={backInputRef}
                  onChange={handleBackImageChange}
                />
                {backImage && <img src={backImage} alt="Back ID Preview" className="id-preview" />}
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={!selectedId || !frontImage || !backImage}>Next</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="verify-modal" style={{marginTop: '80px'}}>
          <button className="modal-close-x" type="button" onClick={onClose}>&#10005;</button>
          <h2>Pay Subscription Fee</h2>
          <form onSubmit={handleSubmitPayment}>
            <div className="payment-modal-flex">
              <div className="qr-section payment-modal-qr">
                <img src="/300.jpg" alt="QR Code for ₱300" className="qr-image qr-image-large" />
              </div>
              <div className="payment-modal-details">
                <label className="payment-label">Pay Yearly Subscription Fee: <b>₱300</b></label>
                <div className="gcash-section">
                  <p>GCash Number:</p>
                  <div className="gcash-number"><b>09158706048</b></div>
                </div>
                <div className="reference-section">
                  <label>Reference Number:</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={!referenceNumber}>Submit</button>
              </div>
            </div>
          </form>
        </div>
      )}
      {showModal && (
        <div className="success-overlay">
          <div className="success-animation">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
            </svg>
            <div className="success-message">Verification Submitted</div>
            <div className="success-subtext">Please wait 24 hours for verification.</div>
          </div>
        </div>
      )}
    </>

  );
}
export default VerifyAccount;
