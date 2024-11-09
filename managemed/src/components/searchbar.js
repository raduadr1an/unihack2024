// src/components/SearchBar.js

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Firebase Firestore import

const SearchBar = ({ collectionName, placeholder = "Search..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Function to handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query (client-side)
    if (query.trim() === '') {
      setFilteredData(data);  // Reset to all data if search is cleared
    } else {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())  // Case-insensitive search
      );
      setFilteredData(filtered);
    }
  };

  // Fetch data from Firestore when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db.collection(collectionName).get();
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(fetchedData);  // Set the fetched data
        setFilteredData(fetchedData);  // Initially, show all data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [collectionName]);  // Fetch data only when the collection name changes

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      {/* Render filtered data */}
      {filteredData.length > 0 ? (
        <ul>
          {filteredData.map(item => (
            <li key={item.id}>{item.name}</li> 
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchBar;
