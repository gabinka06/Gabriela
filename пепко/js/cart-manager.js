/**
 * Enhanced Cart Management System
 * Handles all cart operations with validation and error handling
 */

class CartManager {
  constructor() {
    this.storageKey = 'cart';
    this.cart = this.loadCart();
    this.observers = [];
  }

  /**
   * Load cart from localStorage
   */
  loadCart() {
    const saved = localStorage.getItem(this.storageKey);
    return safeParse(saved, []) || [];
  }

  /**
   * Save cart to localStorage
   */
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.notifyObservers();
      return true;
    } catch (e) {
      console.error('Error saving cart:', e);
      showNotification('Грешка при запазване на количката', 'error');
      return false;
    }
  }

  /**
   * Add item to cart
   */
  addItem(product) {
    if (!product.id || !product.name || product.price === undefined) {
      console.error('Invalid product:', product);
      return false;
    }

    const existing = this.findItem(
      product.id,
      product.flavour1 || '',
      product.flavour2 || ''
    );

    if (existing) {
      if (!this.setQuantity(existing, existing.quantity + 1)) {
        return false;
      }
    } else {
      this.cart.push({
        id: product.id,
        name: sanitizeHtml(product.name),
        price: parseFloat(product.price),
        quantity: 1,
        flavour1: product.flavour1 || '',
        flavour2: product.flavour2 || '',
        image: product.image || ''
      });
    }

    this.saveCart();
    showNotification(`${product.name} е добавено в количката`, 'success');
    return true;
  }

  /**
   * Find cart item
   */
  findItem(id, flavour1 = '', flavour2 = '') {
    return this.cart.find(
      item => item.id === id && item.flavour1 === flavour1 && item.flavour2 === flavour2
    );
  }

  /**
   * Set item quantity with validation
   */
  setQuantity(item, newQty) {
    newQty = parseInt(newQty) || 0;

    if (newQty < 0) {
      console.error('Invalid quantity');
      return false;
    }

    if (newQty === 0) {
      this.removeItem(item.id, item.flavour1, item.flavour2);
      return true;
    }

    // Check stock
    if (typeof getStockForProduct === 'function') {
      const stock = getStockForProduct(item.id);
      if (newQty > stock) {
        showNotification(
          `Недостатъчна наличност!\nНалична: ${stock} бр.`,
          'error'
        );
        return false;
      }
    }

    item.quantity = newQty;
    this.saveCart();
    return true;
  }

  /**
   * Change quantity by delta
   */
  changeQuantity(id, delta, flavour1 = '', flavour2 = '') {
    const item = this.findItem(id, flavour1, flavour2);
    if (!item) return false;
    return this.setQuantity(item, item.quantity + delta);
  }

  /**
   * Remove item from cart
   */
  removeItem(id, flavour1 = '', flavour2 = '') {
    const index = this.cart.findIndex(
      item => item.id === id && item.flavour1 === flavour1 && item.flavour2 === flavour2
    );

    if (index > -1) {
      const removed = this.cart.splice(index, 1)[0];
      this.saveCart();
      showNotification(`${removed.name} е премахнато от количката`, 'success');
      return true;
    }
    return false;
  }

  /**
   * Clear entire cart
   */
  clear() {
    this.cart = [];
    this.saveCart();
  }

  /**
   * Get cart total
   */
  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  /**
   * Get item count
   */
  getCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Get all items
   */
  getItems() {
    return [...this.cart];
  }

  /**
   * Observer pattern for UI updates
   */
  subscribe(callback) {
    this.observers.push(callback);
  }

  notifyObservers() {
    this.observers.forEach(callback => callback(this.cart));
  }

  /**
   * Export cart data
   */
  export() {
    return {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
      timestamp: new Date().toISOString()
    };
  }
}

// Global instance
const cartManager = new CartManager();