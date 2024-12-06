import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-warehouse me-2"></i>
          Inventory Management
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>
                Dashboard
              </Link>
            </li>
            {currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/inventory">
                    <i className="fas fa-box-open me-1"></i>
                    Inventory
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/categories">
                    <i className="fas fa-tags me-1"></i>
                    Categories
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reports">
                    <i className="fas fa-chart-bar me-1"></i>
                    Reports
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="fas fa-chart-bar me-1"></i>
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="navbar-nav">
            {currentUser ? (
              <>
                <span className="navbar-text me-3">
                  <i className="fas fa-user me-1"></i>
                  {currentUser.email}
                </span>
                <button 
                  className="btn btn-outline-light" 
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-outline-light me-2"
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-light"
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;