import React, { useState } from 'react';
import InventoryService from '../../services/inventoryService';

function AddItemModal({ onClose, onAddItem }) {
  const [itemData, setItemData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData(prevState => ({
      ...prevState,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await InventoryService.addItem(itemData);
      onAddItem();
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Inventory Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              name="name"
              value={itemData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={itemData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Furniture">Furniture</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={itemData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price per Unit ($)</label>
            <input
              type="number"
              name="price"
              value={itemData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={itemData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;