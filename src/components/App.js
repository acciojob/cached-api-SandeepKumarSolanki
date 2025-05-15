import React, { useState, useEffect, useMemo } from 'react';
import 'regenerator-runtime/runtime';


const App = () => {
  const [userId, setUserId] = useState('');
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Effect to fetch data from the API when userId changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = userId
          ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
          : `https://jsonplaceholder.typicode.com/posts`;

        const response = await fetch(url);
        const data = await response.json();
        setRawData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRawData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Memoized processed data
  const memoizedData = useMemo(() => {
    // Example transformation: only return titles
    return rawData.map(post => ({
      id: post.id,
      title: post.title,
    }));
  }, [rawData]);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h2>Cached Posts Viewer</h2>
      <label>
        Filter by User ID:
        <input
          type="number"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="e.g., 1"
          style={{ marginLeft: '10px' }}
        />
      </label>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {memoizedData.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
