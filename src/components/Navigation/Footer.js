import React from 'react';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-primary text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
          <h5 className="d-flex align-items-center">
            <i className="fas fa-warehouse me-2"></i>
               Inventory Management
          </h5>
            <p className="text-white">
              Streamline your inventory tracking with real-time updates and insights.
            </p>
          </div>
          
          <div className="col-md-4">
            {/* <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/inventory" className="text-white">Inventory</a></li>
              <li><a href="/reports" className="text-white">Reports</a></li>
            </ul> */}
          </div>
          
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-envelope me-2"></i>
                support@inventorymanager.com
              </li>
              <li>
                <i className="fas fa-phone me-2"></i>
                +1 (555) 123-4567
              </li>
            </ul>
            {/* <div className="social-icons">
              <a href="#" className="text-white me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div> */}
          </div>
        </div>
        
        <hr className="my-3 text-muted" />
        
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Inventory Management System. 
            All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;