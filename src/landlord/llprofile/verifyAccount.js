import React, { useRef, useState } from 'react';
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
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [idMethod, setIdMethod] = useState('upload');
  const frontInputRef = useRef();
  const backInputRef = useRef();

  const handleFrontImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFrontImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleBackImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
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
    if (onSubmit) onSubmit({ selectedId, frontImage, backImage, referenceNumber });
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
            <div className="payment-section">
              <label>Pay Subscription Fee: <b>₱100</b></label>
              <div className="qr-section">
                <img src="/images/qr-placeholder.png" alt="QR Code" className="qr-image" />
                <p>Or copy number: <b>09123456789</b></p>
              </div>
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
          </form>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Verification Submitted</h3>
            <p>Please wait 24 hours for verification.</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifyAccount;
