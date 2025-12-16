import React, { useState, useEffect } from 'react';
import './home.css';
import Navbar from '../navbar/navbar';
import BHDetails from '../bhdetails/bhdetails';
import { getAllBoardingHouses } from '../../services/bhservice';
import { useLocation } from 'react-router-dom';

const Home = ({ onLogout }) => {

  const [selectedHouse, setSelectedHouse] = useState(null);
  const [likedHouses, setLikedHouses] = useState(new Set());
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch boarding houses from Firestore
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true);
        console.log('=== FETCHING BOARDING HOUSES ===');
        const data = await getAllBoardingHouses();
        console.log('Total documents fetched:', data.length);
        console.log('Fetched boarding houses:', data);
        
        if (data && data.length > 0) {
          console.log('\n=== ANALYZING FIRST DOCUMENT ===');
          const firstHouse = data[0];
          console.log('House ID:', firstHouse.id);
          console.log('House name:', firstHouse.name);
          console.log('All keys in document:', Object.keys(firstHouse).sort());
          console.log('Document full data:', JSON.stringify(firstHouse, null, 2));
          console.log('\n=== IMAGE FIELD ANALYSIS ===');
          console.log('Has "images" field?', 'images' in firstHouse);
          console.log('Has "image" field?', 'image' in firstHouse);
          console.log('typeof images:', typeof firstHouse.images);
          console.log('Array.isArray(images):', Array.isArray(firstHouse.images));
          console.log('images value:', firstHouse.images);
          console.log('images length:', firstHouse.images?.length);
          if (firstHouse.images && firstHouse.images.length > 0) {
            console.log('First image URL:', firstHouse.images[0]);
            console.log('First image type:', typeof firstHouse.images[0]);
          }
        } else {
          console.warn('No documents found in Boardinghouse collection!');
        }
        
        setBoardingHouses(data);
        setFilteredHouses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching boarding houses:', err);
        setError(err.message);
        setBoardingHouses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  // Apply search filtering based on `q` query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').trim().toLowerCase();

    console.log('[HOME] Search effect triggered');
    console.log('[HOME] location.search:', location.search);
    console.log('[HOME] Extracted query param q:', q);
    console.log('[HOME] Total boarding houses available:', boardingHouses.length);

    if (!q) {
      console.log('[HOME] No search query, showing all houses');
      setFilteredHouses(boardingHouses);
      return;
    }

    const matchesSearch = (house) => {
      const name = (house.name || house['Boarding House Name'] || house['Name'] || '').toString().toLowerCase();
      const address = (house.address || house.Address || house.location?.address || '').toString().toLowerCase();
      const type = (house.type || house['Type of Boarding House'] || '').toString().toLowerCase();
      
      const matches = name.includes(q) || address.includes(q) || type.includes(q);
      
      if (matches) {
        console.log(`[HOME] Match found: ${house.name} (name:"${name}" addr:"${address}" type:"${type}")`);
      }
      
      return matches;
    };

    const filtered = boardingHouses.filter(matchesSearch);
    console.log(`[HOME] Search results: ${filtered.length} matches for "${q}"`);
    setFilteredHouses(filtered);
  }, [location.search, boardingHouses]);

  // Load liked houses from localStorage on mount
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likedHouses') || '[]');
    setLikedHouses(new Set(savedLikes));
  }, []);

  const toggleLike = (houseId) => {
    const newLikedHouses = new Set(likedHouses);
    if (newLikedHouses.has(houseId)) {
      newLikedHouses.delete(houseId);
    } else {
      newLikedHouses.add(houseId);
    }
    
    // Save to localStorage
    localStorage.setItem('likedHouses', JSON.stringify([...newLikedHouses]));
    setLikedHouses(newLikedHouses);
  };

  const BoardingHouseCard = ({ house }) => {
    const hasImages = house.images && Array.isArray(house.images) && house.images.length > 0;
    const thumbnail = hasImages ? house.images[0] : (house.image || '/default.png');

    // Determine status color and text
    const getStatusInfo = (status) => {
      switch (status) {
        case 'reserved':
          return { color: '#ff9800', text: 'Reserved' };
        case 'occupied':
          return { color: '#f44336', text: 'Occupied' };
        default:
          return { color: '#4caf50', text: '' };
      }
    };

    const statusInfo = getStatusInfo(house.status);

    return (
      <div className="boarding-card" onClick={() => setSelectedHouse(house)}>
        <div className="card-image">
          <img
            src={thumbnail}
            alt={house.name || house['Boarding House Name'] || 'Boarding House'}
            onError={(e) => {
              console.error(`Image failed to load for "${house.name}":`, {
                attemptedUrl: e.target.src,
                hasImages: hasImages,
                imageCount: house.images?.length,
                allImages: house.images
              });
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
            }}
            onLoad={() => console.log(`Image loaded for "${house.name}":`, thumbnail)}
          />
          <div
            className="status-badge"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: statusInfo.color,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 10
            }}
          >
            {statusInfo.text}
          </div>
        </div>
        <div className="card-content">
          <h3>{house.name || house['Boarding House Name'] || 'Untitled'}</h3>
          <p className="address">{house.address || house.Address || ''}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="homepage">
      <Navbar />
      <div className="background-image"></div>
      
      <main className="main-content">
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Loading boarding houses...
          </div>
        )}

        {error && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>
            Error loading boarding houses: {error}
          </div>
        )}

        {!loading && !error && boardingHouses.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            <p>No boarding houses available at the moment.</p>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              (If you just added one, it may take a moment to appear. Try refreshing the page.)
            </p>
          </div>
        )}

        {!loading && !error && boardingHouses.length > 0 && (
          <section className="boarding-section">
            <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Boarding Houses</h2>
            <div className="boarding-grid">
              {filteredHouses.length > 0 ? (
                filteredHouses
                  .filter(house => house.status !== 'occupied')
                  .map((house) => (
                    <BoardingHouseCard key={house.id} house={house} />
                  ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999' }}>
                  No boarding houses match your search
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <BHDetails 
        house={selectedHouse}
        isOpen={!!selectedHouse}
        onClose={() => setSelectedHouse(null)}
        likedHouses={likedHouses}
        onToggleLike={toggleLike}
      />
    </div>
  );
};

export default Home;