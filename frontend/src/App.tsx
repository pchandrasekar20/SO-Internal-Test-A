import { useState, useEffect } from 'react';

function App(): JSX.Element {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => setMessage(data.message || 'Connected to backend'))
      .catch(() => setMessage('Failed to connect to backend'));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Full Stack TypeScript App</h1>
      <p>Backend Status: {message}</p>
    </div>
  );
}

export default App;
