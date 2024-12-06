// src/components/Auth/PasswordReset.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import '../../styles/Auth.css';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your inbox for password reset instructions');
    } catch (err) {
      setError('Failed to reset password. ' + err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <h2 className="auth-title">Reset Password</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="email" 
            className="auth-input"
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Sending Reset Link...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="auth-switch">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;