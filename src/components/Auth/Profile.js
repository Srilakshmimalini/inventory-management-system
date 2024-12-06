import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Auth.css';

function Profile() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <h2 className="auth-title">User Profile</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <div className="profile-details">
          <strong>Email:</strong> {currentUser.email}
        </div>
        
        <div className="auth-form">
          <button 
            className="auth-button logout-button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;