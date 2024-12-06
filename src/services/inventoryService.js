import { 
  collection, 
  addDoc, 
  updateDoc,  
  getDocs, 
  doc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  writeBatch
} from 'firebase/firestore';
import { firestore } from './firebaseConfig';

class InventoryService {
  constructor() {
    this.inventoryCollection = collection(firestore, 'inventory');
  }

  // Comprehensive error handler
  handleError(error, defaultMessage = 'An unexpected error occurred') {
    console.error(error);
    return {
      success: false,
      error: error.message || defaultMessage
    };
  }

  // Validate item data
  validateItem(item) {
    const errors = [];

    if (!item.name || item.name.trim() === '') {
      errors.push('Item name is required');
    }

    if (!item.category || item.category.trim() === '') {
      errors.push('Category is required');
    }

    if (typeof item.quantity !== 'number' || item.quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }

    if (typeof item.price !== 'number' || item.price < 0) {
      errors.push('Price must be a non-negative number');
    }

    return errors;
  }

  // Add new inventory item
  async addItem(item) {
    try {
      const validationErrors = this.validateItem(item);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      const docRef = await addDoc(this.inventoryCollection, {
        ...item,
        createdAt: new Date(),
        lastUpdated: new Date(),
        active: true
      });

      return {
        success: true,
        itemId: docRef.id,
        message: 'Item added successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to add item');
    }
  }

  // Get inventory summary with detailed statistics
  async getInventorySummary() {
    try {
      // Fetch all items
      const querySnapshot = await getDocs(this.inventoryCollection);
      
      if (querySnapshot.empty) {
        return {
          success: true,
          summary: {
            totalItems: 0,
            totalValue: 0,
            categories: {},
            lowStockItems: [],
            mostExpensiveItem: null,
            highestStockItem: null
          }
        };
      }

      // Process items
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate summary statistics
      const summary = {
        totalItems: items.length,
        totalValue: 0,
        categories: {},
        lowStockItems: [],
        mostExpensiveItem: null,
        highestStockItem: null
      };

      let mostExpensivePrice = 0;
      let highestStockQuantity = 0;

      // Iterate through items to calculate summary
      items.forEach(item => {
        // Total inventory value
        const itemValue = item.quantity * item.price;
        summary.totalValue += itemValue;

        // Category tracking
        summary.categories[item.category] = 
          (summary.categories[item.category] || 0) + 1;

        // Low stock items (less than 10)
        if (item.quantity < 10) {
          summary.lowStockItems.push({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity
          });
        }

        // Most expensive item
        if (item.price > mostExpensivePrice) {
          mostExpensivePrice = item.price;
          summary.mostExpensiveItem = {
            id: item.id,
            name: item.name,
            price: item.price
          };
        }

        // Highest stock item
        if (item.quantity > highestStockQuantity) {
          highestStockQuantity = item.quantity;
          summary.highestStockItem = {
            id: item.id,
            name: item.name,
            quantity: item.quantity
          };
        }
      });

      // Round total value to 2 decimal places
      summary.totalValue = Number(summary.totalValue.toFixed(2));

      return {
        success: true,
        summary
      };
    } catch (error) {
      return this.handleError(error, 'Failed to generate inventory summary');
    }
  }

  // Update inventory item
  async updateItem(itemId, updatedItem) {
    try {
      const validationErrors = this.validateItem(updatedItem);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      const itemDoc = doc(firestore, 'inventory', itemId);
      
      await updateDoc(itemDoc, {
        ...updatedItem,
        lastUpdated: new Date()
      });

      return {
        success: true,
        message: 'Item updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update item');
    }
  }

  // Bulk update items
  async bulkUpdateItems(items) {
    try {
      const batch = writeBatch(firestore);

      items.forEach(item => {
        if (!item.id) {
          console.warn('Skipping item without ID');
          return;
        }

        const validationErrors = this.validateItem(item);
        if (validationErrors.length > 0) {
          console.warn(`Skipping invalid item: ${validationErrors.join(', ')}`);
          return;
        }

        const itemDoc = doc(firestore, 'inventory', item.id);
        batch.update(itemDoc, {
          ...item,
          lastUpdated: new Date()
        });
      });

      await batch.commit();

      return {
        success: true,
        message: 'Bulk update completed successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to perform bulk update');
    }
  }

  // Advanced filtering method
  async filterItems(filters = {}) {
    try {
      let q = query(this.inventoryCollection);

      // Name filter (case-insensitive)
      if (filters.name) {
        q = query(
          q, 
          where('name', '>=', filters.name.toLowerCase()),
          where('name', '<=', filters.name.toLowerCase() + '\uf8ff')
        );
      }
      
      // Category filter
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      // Quantity range filter
      if (filters.minQuantity !== undefined) {
        q = query(q, where('quantity', '>=', filters.minQuantity));
      }
      
      if (filters.maxQuantity !== undefined) {
        q = query(q, where('quantity', '<=', filters.maxQuantity));
      }
      
      // Price range filter
      if (filters.minPrice !== undefined) {
        q = query(q, where('price', '>=', filters.minPrice));
      }
      
      if (filters.maxPrice !== undefined) {
        q = query(q, where('price', '<=', filters.maxPrice));
      }

      const querySnapshot = await getDocs(q);
      
      const filteredItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        items: filteredItems,
        count: filteredItems.length
      };
    } catch (error) {
      return this.handleError(error, 'Failed to filter items');
    }
  }

  // Get all items with pagination
  async getAllItems(pageSize = 10, lastVisible = null) {
    try {
      let q = query(
        this.inventoryCollection, 
        orderBy('createdAt', 'desc'), 
        limit(pageSize)
      );

      if (lastVisible) {
        q = query(
          this.inventoryCollection,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const lastItem = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        success: true,
        items: items,
        lastVisible: lastItem,
        count: items.length
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch items');
    }
  }
}

// Create and export service instance
const inventoryService = new InventoryService();
export default inventoryService;