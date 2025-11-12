import React, { useState, useEffect } from 'react';
import { 
  getAllBoardingHouses, 
  addBoardingHouse,
  updateBoardingHouse,
  deleteBoardingHouse 
} from '../services/boardingHouseService';

function bhlist() {
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load boarding houses when component mounts
  useEffect(() => {
    loadBoardingHouses();
  }, []);

  // Function to load all boarding houses
  const loadBoardingHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const houses = await getAllBoardingHouses();
      setBoardingHouses(houses);
      console.log("Loaded boarding houses:", houses);
    } catch (err) {
      console.error("Error loading boarding houses:", err);
      setError("Failed to load boarding houses. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Function to add a test boarding house
  const handleAddTest = async () => {
    const testHouse = {
      "Address": "456 Test Street, Isabela",
      "Boarding House Name": "Test Boarding House",
      "Description": "This is a test boarding house added from React",
      "Price": 1200,
      "Type of Boarding House": "Double room"
    };

    try {
      const newId = await addBoardingHouse(testHouse);
      alert(`Successfully added! Document ID: ${newId}`);
      loadBoardingHouses(); // Reload the list
    } catch (err) {
      console.error("Error adding:", err);
      alert("Failed to add. Check console.");
    }
  };

  // Function to update a boarding house
  const handleUpdate = async (id) => {
    try {
      await updateBoardingHouse(id, {
        "Price": 950
      });
      alert("Successfully updated!");
      loadBoardingHouses(); // Reload the list
    } catch (err) {
      console.error("Error updating:", err);
      alert("Failed to update. Check console.");
    }
  };

  // Function to delete a boarding house
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this boarding house?")) {
      try {
        await deleteBoardingHouse(id);
        alert("Successfully deleted!");
        loadBoardingHouses(); // Reload the list
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Failed to delete. Check console.");
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading boarding houses...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>Error:</h3>
        <p>{error}</p>
        <button onClick={loadBoardingHouses}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Boarding Houses</h1>
      
      <button 
        onClick={handleAddTest}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Test Boarding House
      </button>

      <button 
        onClick={loadBoardingHouses}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          marginLeft: '10px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh List
      </button>

      <p>Total boarding houses: {boardingHouses.length}</p>

      <div style={{ display: 'grid', gap: '20px' }}>
        {boardingHouses.map((house) => (
          <div 
            key={house.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{house["Boarding House Name"]}</h3>
            <p><strong>Address:</strong> {house.Address}</p>
            <p><strong>Type:</strong> {house["Type of Boarding House"]}</p>
            <p><strong>Price:</strong> ₱{house.Price}</p>
            <p><strong>Description:</strong> {house.Description}</p>
            <p><strong>Document ID:</strong> {house.id}</p>
            
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => handleUpdate(house.id)}
                style={{
                  padding: '5px 15px',
                  marginRight: '10px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Update Price
              </button>
              
              <button 
                onClick={() => handleDelete(house.id)}
                style={{
                  padding: '5px 15px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {boardingHouses.length === 0 && (
        <p>No boarding houses found. Try adding one!</p>
      )}
    </div>
  );
}

export default bhlist;