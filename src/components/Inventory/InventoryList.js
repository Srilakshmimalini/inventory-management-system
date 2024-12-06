import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/inventoryService';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';

function InventoryList() {
  // State management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filtering states
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minQuantity: '',
    maxQuantity: '',
    minPrice: '',
    maxPrice: ''
  });

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from database
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await InventoryService.getAllItems();
      
      if (result.success) {
        setItems(result.items);
        setFilteredItems(result.items);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    try {
      const result = await InventoryService.deleteItem(itemId);
      
      if (result.success) {
        // Remove item from local state
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        setFilteredItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...items];

    // Name filter
    if (filters.name) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(item => 
        item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Quantity range filter
    if (filters.minQuantity) {
      result = result.filter(item => 
        item.quantity >= Number(filters.minQuantity)
      );
    }
    if (filters.maxQuantity) {
      result = result.filter(item => 
        item.quantity <= Number(filters.maxQuantity)
      );
    }

    // Price range filter
    if (filters.minPrice) {
      result = result.filter(item => 
        item.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      result = result.filter(item => 
        item.price <= Number(filters.maxPrice)
      );
    }

    setFilteredItems(result);
  };

  // Render categories dropdown
  const renderCategoryDropdown = () => {
    const categories = [...new Set(items.map(item => item.category))];
    
    return (
      <select 
        value={filters.category} 
        onChange={(e) => setFilters(prev => ({
          ...prev, 
          category: e.target.value
        }))}
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="inventory-container">
      <h1>Inventory Management</h1>

      {/* Filtering Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by Name"
          value={filters.name}
          onChange={(e) => setFilters(prev => ({
            ...prev, 
            name: e.target.value
          }))}
        />

        {renderCategoryDropdown()}

        <input
          type="number"
          placeholder="Min Quantity"
          value={filters.minQuantity}
          onChange={(e) => setFilters(prev => ({
            ...prev, 
            minQuantity: e.target.value
          }))}
        />

        <input
          type="number"
          placeholder="Max Quantity"
          value={filters.maxQuantity}
          onChange={(e) => setFilters(prev => ({
            ...prev, 
            maxQuantity: e.target.value
          }))}
        />

        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={() => {
          setFilters({
            name: '',
            category: '',
            minQuantity: '',
            maxQuantity: '',
            minPrice: '',
            maxPrice: ''
          });
          setFilteredItems(items);
        }}>
          Reset
        </button>

        <button onClick={() => setIsAddModalOpen(true)}>
          Add New Item
        </button>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && <div>Loading inventory...</div>}

      {/* Inventory Table */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEditItem(item)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No items found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onAddItem={(result) => {
            // Refresh items or add new item to local state
            fetchItems();
          }}
        />
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <EditItemModal
          item={selectedItem}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateItem={() => {
            // Refresh items
            fetchItems();
          }}
        />
      )}
    </div>
  );
}

export default InventoryList;