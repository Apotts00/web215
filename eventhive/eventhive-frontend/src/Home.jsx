import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>🎉Welcome to EventHive!🎉</h1>
      <p>Click <Link to="/login">here</Link> to log in.</p>
    </div>
  );
}
