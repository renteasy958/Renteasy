import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './search.css';
import { getAllBoardingHouses } from '../../services/bhservice';
import BHDetails from '../bhdetails/bhdetails';

const SearchResults = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [houses, setHouses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [likedHouses, setLikedHouses] = useState(new Set());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').trim();
    setQuery(q);
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
    if (!q) {
      setFiltered(houses);
      return;
    }

    const matches = houses.filter((h) => {
      const name = (h.name || h['Boarding House Name'] || '').toString().toLowerCase();
      const address = (h.address || h.Address || h.location?.address || '').toString().toLowerCase();
      const type = (h.type || h['Type of Boarding House'] || '').toString().toLowerCase();
      const desc = (h.description || h.Description || '').toString().toLowerCase();
      return name.includes(q) || address.includes(q) || type.includes(q) || desc.includes(q);
    });

    setFiltered(matches);
  }, [query, houses]);

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
    return (
      <div className="search-card" onClick={() => setSelectedHouse(h)}>
        <div className="search-card-image" style={{ backgroundImage: `url(${thumbnail})` }} />
        <div className="search-card-body">
          <h3>{h.name || h['Boarding House Name'] || 'Untitled'}</h3>
          <p className="address">{h.address || h.Address || ''}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="search-hero-inner">
          <h1>Search Results</h1>
          <p className="search-query">Showing results for "{query}"</p>
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
              <div className="no-results">No boarding houses match your search.</div>
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
