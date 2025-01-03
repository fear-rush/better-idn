"use client"

import { useState } from 'react';

// Define a type for the API response
type ApiResponse = {
  status?: string;
  statusCode?: number;
  message?: string;
  error?: string;
  data?: any;
} | null;

export default function Home() {
  const [response, setResponse] = useState<ApiResponse>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  };

  const handleSignIn = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for session management
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/v1/sessions', {
        method: 'DELETE',
        credentials: 'include', // Include cookies for session management
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  };

  const handleGetCurrentUser = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/v1/sessions', {
        method: 'GET',
        credentials: 'include', // Include cookies for session management
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  };

  return (
    <div className='p-4 mt-20'>
      <h1>User Authentication Demo</h1>

      <div>
        <h2>Create User</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <div>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSignIn}>Sign In</button>
      </div>

      <div>
        <h2>Sign Out</h2>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <div>
        <h2>Get Current User</h2>
        <button onClick={handleGetCurrentUser}>Get Current User</button>
      </div>

      <div>
        <h2>Response</h2>
        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
}