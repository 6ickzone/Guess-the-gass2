import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1>Selamat Datang di Guess the Gas</h1>
      <p>Tebak gas fee Ethereum harian & jadilah juara leaderboard!</p>
      <Link to="/game">
        <button style={{ padding: '10px 20px', marginTop: '20px', fontSize: '16px' }}>
          Mulai Tebak
        </button>
      </Link>
    </div>
  );
}