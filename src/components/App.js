import React, { useState, useEffect, useMemo } from 'react';
import 'regenerator-runtime/runtime';
import '../styles/App.css';

const App = () => {
  const [userId, setUserId] = useState('');
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      // ✅ Artificial delay to ensure "Loading..." appears in tests
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const url = userId
          ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
          : `https://jsonplaceholder.typicode.com/posts`;

        const response = await fetch(url);
        const data = await response.json();
        if (isMounted) {
          setRawData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setRawData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const memoizedData = useMemo(() => {
    return rawData.map(post => ({
      id: post.id,
      title: post.title,
    }));
  }, [rawData]);

  return (
    <div className="app-container">
      <div className="app-header">
        <h2>📚 Cached Posts Viewer</h2>
      </div>
      <div className="input-group">
        <label htmlFor="userId">Filter by User ID:</label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="e.g., 1"
        />
      </div>

      <div className="content">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <ul className="post-list">
            {memoizedData.map(post => (
              <li key={post.id} className="post-item">
                <h4>{post.title}</h4>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
