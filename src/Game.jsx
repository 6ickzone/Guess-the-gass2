import { useState, useEffect } from 'react';

export default function Game() {
  const [guess, setGuess] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [timer, setTimer] = useState(3600); // 1 hour countdown
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleGuessSubmit = () => {
    if (!guess || !walletAddress) return;
    const submission = { wallet: walletAddress, guess: parseFloat(guess) };
    setSubmissions(prev => [...prev, submission]);
    updateLeaderboard(walletAddress);
    setGuess('');
  };

  const updateLeaderboard = (wallet) => {
    setWeeklyLeaderboard(prev => {
      const existing = prev.find(entry => entry.wallet === wallet);
      if (existing) {
        return prev.map(entry => entry.wallet === wallet ? { ...entry, points: entry.points + 1 } : entry);
      } else {
        return [...prev, { wallet, points: 1 }];
      }
    });
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Guess the Gas</h1>
      <p>Connected Wallet: {walletAddress || 'Not connected'}</p>
      <button onClick={connectWallet}>Connect Wallet</button>
      <br /><br />
      <input
        type="number"
        placeholder="Enter GWEI guess"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <button onClick={handleGuessSubmit}>Submit</button>
      <p>Countdown: {formatTime(timer)}</p>

      <h2>Today's Submissions</h2>
      <ul>
        {submissions.map((s, i) => (
          <li key={i}>
            - {s.wallet.slice(0, 6)}...{s.wallet.slice(-4)} guessed {s.guess} GWEI
          </li>
        ))}
      </ul>

      <h2>Weekly Leaderboard</h2>
      <ul>
        {weeklyLeaderboard
          .sort((a, b) => b.points - a.points)
          .map((entry, i) => (
            <li key={i}>
              #{i + 1} {entry.wallet.slice(0, 6)}...{entry.wallet.slice(-4)} — {entry.points} pts
            </li>
          ))}
      </ul>
    </div>
  );
}
