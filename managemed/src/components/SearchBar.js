import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';

const SearchBar = ({ collectionName, placeholder = "Search..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredData(data); 
    } else {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db.collection(collectionName).get();
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(fetchedData);          
        setFilteredData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [collectionName]);

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
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
