import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/inventoryService';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import './InventorySummary.css';

function InventorySummary() {
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalValue: 0,
    categories: {},
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventorySummary();
  }, []);

  const fetchInventorySummary = async () => {
    try {
      setLoading(true);
      const result = await InventoryService.getInventorySummary();

      if (result.success) {
        setSummary(result.summary);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch inventory summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare Pie Chart Data for Categories
  const getCategoryData = () => {
    const categories = Object.entries(summary.categories);
    return categories.map(([category, count]) => ({
      name: category,
      value: count
    }));
  };

  // Pie chart colors
  const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

  if (loading) {
    return (
      <div className="inventory-summary-loading">
        <div className="spinner"></div>
        <p>Loading inventory summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-summary-error">
        <p>{error}</p>
        <button onClick={fetchInventorySummary}>Retry</button>
      </div>
    );
  }

  return (
    <div className="inventory-summary-container">
      <h2 className="dashboard-header">Inventory Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Items</h3>
          <p>{summary.totalItems}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Inventory Value</h3>
          <p>${summary.totalValue.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Categories</h3>
          <p>{Object.keys(summary.categories).length}</p>
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>Inventory by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alert */}
      
      <div className="low-stock-section">
        <h2>Low Stock Alerts</h2>
        {summary.lowStockItems.length > 0 ? (
          <table className="low-stock-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Current Quantity</th>
                
              </tr>
            </thead>
            <tbody>
              {summary.lowStockItems.map((item) => (
                <tr key={item.id} className="low-stock-item">
                  <td>{item.name}</td>
                  <td>{item.category ? item.category : 'Category not available'}</td>
                  <td>{item.quantity}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No low stock items</p>
        )}
      </div>
    </div>
  );
}

export default InventorySummary;
