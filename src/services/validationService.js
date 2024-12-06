class ValidationService {
    // Email Validation
    static validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    // Password Validation
    static validatePassword(password) {
      // At least 8 characters, one uppercase, one lowercase, one number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return passwordRegex.test(password);
    }
  
    // Validate Inventory Item
    static validateInventoryItem(item) {
      const errors = {};
  
      // Name validation
      if (!item.name || item.name.trim() === '') {
        errors.name = 'Item name is required';
      }
  
      // Category validation
      if (!item.category || item.category.trim() === '') {
        errors.category = 'Category is required';
      }
  
      // Quantity validation
      if (item.quantity === undefined || item.quantity < 0) {
        errors.quantity = 'Quantity must be a non-negative number';
      }
  
      // Price validation
      if (item.price === undefined || item.price < 0) {
        errors.price = 'Price must be a non-negative number';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  }
  
  export default ValidationService;