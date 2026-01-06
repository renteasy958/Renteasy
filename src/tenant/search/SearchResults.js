import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './search.css';
import { getAllBoardingHouses } from '../../services/bhservice';
import BHDetails from '../bhdetails/bhdetails';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ type: null, location: null, priceRange: null });
  const [houses, setHouses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [likedHouses, setLikedHouses] = useState(new Set());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').trim();
    setQuery(q);
    const type = (params.get('type') || null);
    const locationFilter = (params.get('location') || null);
    const priceRange = (params.get('priceRange') || null);
    setAppliedFilters({ type, location: locationFilter, priceRange });
  }, [location.search]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getAllBoardingHouses();
        setHouses(data || []);
      } catch (err) {
        console.error('Error fetching for search:', err);
        setHouses([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    const q = (query || '').toLowerCase();
    
    // Normalize search query to handle barangay variations
    const normalizeSearch = (text) => {
      return text
        .replace(/\bbrgy\b/gi, 'barangay')
        .replace(/\bbrgy\./gi, 'barangay')
        .replace(/\bbrgys\b/gi, 'barangay');
    };

    const matches = houses.filter((h) => {
      // Exclude reserved and occupied houses from search results
      if (h.status === 'reserved' || h.status === 'occupied') return false;

      const name = (h.name || h['Boarding House Name'] || '').toString().toLowerCase();
      const address = (h.address || h.Address || h.location?.address || '').toString().toLowerCase();
      const type = (h.type || h['Type of Boarding House'] || '').toString().toLowerCase();
      const desc = (h.description || h.Description || '').toString().toLowerCase();
      const price = (h.price || h.Price || h.priceRange || '').toString().toLowerCase();
      const roomType = (h.roomType || h.room_type || h['Room Type'] || h['Type'] || '').toString().toLowerCase();

      // Normalize search query and address for barangay matching
      const normalizedQ = normalizeSearch(q);
      const normalizedAddress = normalizeSearch(address);

      // Text match: if q is empty, allow; otherwise require at least one field to include q
      const textMatch = !q || (
        name.includes(q) ||
        normalizedAddress.includes(normalizedQ) ||
        type.includes(q) ||
        desc.includes(q) ||
        price.includes(q) ||
        roomType.includes(q)
      );

      if (!textMatch) return false;

      // Applied filters (from navbar)
      if (appliedFilters.type) {
        const ft = appliedFilters.type.toString().toLowerCase();
        if (!(roomType.includes(ft) || type.includes(ft) || name.includes(ft))) return false;
      }

      if (appliedFilters.location) {
        const fl = appliedFilters.location.toString().toLowerCase();
        if (!address.includes(fl)) return false;
      }

      if (appliedFilters.priceRange) {
        // priceRange passed as code like '500-2000', '2001-5000', '5001-up'
        const numMatch = (price.match(/\d+/) || [null])[0];
        const pval = numMatch ? parseInt(numMatch, 10) : 0;
        const pr = appliedFilters.priceRange;
        if (pr === '500-2000' && !(pval >= 500 && pval <= 2000)) return false;
        if (pr === '2001-5000' && !(pval >= 2001 && pval <= 5000)) return false;
        if (pr === '5001-up' && !(pval >= 5001)) return false;
      }

      return true;
    });

    setFiltered(matches);
  }, [query, houses, appliedFilters]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('likedHouses') || '[]');
    setLikedHouses(new Set(saved));
  }, []);

  const toggleLike = (id) => {
    const s = new Set(likedHouses);
    if (s.has(id)) s.delete(id); else s.add(id);
    setLikedHouses(s);
    localStorage.setItem('likedHouses', JSON.stringify([...s]));
  };

  const Card = ({ h }) => {
    const thumbnail = (h.images && Array.isArray(h.images) && h.images[0]) || h.image || '/default.png';
    // Format address if it's an object
    let formattedAddress = '';
    if (h.address && typeof h.address === 'object' && h.address !== null) {
      const { streetSitio, barangay, cityMunicipality, province } = h.address;
      formattedAddress = [streetSitio, barangay, cityMunicipality, province].filter(Boolean).join(', ');
    } else {
      formattedAddress = h.address || h.Address || '';
    }
    return (
      <div className="search-card" onClick={() => setSelectedHouse(h)}>
        <div className="search-card-image" style={{ backgroundImage: `url(${thumbnail})` }} />
        <div className="search-card-body">
          <h3>{h.name || h['Boarding House Name'] || 'Untitled'}</h3>
          <p className="address">{formattedAddress}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="search-hero-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="back-btn-search"
              onClick={() => navigate('/tenant-home')}
              

            >
             ← 
            </button>
            <p className="search-query">Showing results for "{query}"</p>
          </div>
        </div>
      </div>

      <main className="search-main">
        {loading ? (
          <div className="search-loading">Loading results...</div>
        ) : (
          <div className="search-results-grid">
            {filtered.length > 0 ? (
              filtered.map((h) => <Card key={h.id} h={h} />)
            ) : (
              <div className="ohno-results">No boarding houses match your search.</div>
            )}
          </div>
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

export default SearchResults;
