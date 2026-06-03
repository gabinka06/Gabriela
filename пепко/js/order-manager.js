/**
 * Order Management System
 * Handles order creation, tracking, and history
 */

class OrderManager {
  constructor() {
    this.storageKey = 'orders';
    this.orders = this.loadOrders();
  }

  /**
   * Load orders from localStorage
   */
  loadOrders() {
    return safeParse(localStorage.getItem(this.storageKey), []);
  }

  /**
   * Save orders to localStorage
   */
  saveOrders() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
      return true;
    } catch (e) {
      console.error('Error saving orders:', e);
      return false;
    }
  }

  /**
   * Create new order
   */
  createOrder(cart, customer, summary) {
    if (!cart || !cart.length) {
      showNotification('Количката е празна', 'error');
      return null;
    }

    // Validate customer data
    const validation = FormValidator.validateCheckoutForm();
    if (!validation.valid) {
      FormValidator.showErrors(validation.errors);
      return null;
    }

    const order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, confirmed, shipped, delivered, cancelled
      customer: {
        name: sanitizeHtml(customer.name),
        surname: sanitizeHtml(customer.surname),
        email: sanitizeHtml(customer.email),
        phone: sanitizeHtml(customer.phone),
        address: sanitizeHtml(customer.address),
        notes: sanitizeHtml(customer.notes || '')
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        flavour1: item.flavour1 || '',
        flavour2: item.flavour2 || ''
      })),
      summary: {
        itemsSubtotal: summary.itemsSubtotalBgn,
        deliveryFee: summary.deliveryFeeBgn,
        grandTotal: summary.grandTotalBgn,
        currency: 'BGN'
      },
      delivery: {
        method: customer.delivery || 'office',
        carrier: customer.carrier || '',
        office: customer.office || '',
        address: customer.address || ''
      },
      payment: {
        method: customer.paymentMethod || 'cash',
        status: 'pending' // pending, authorized, captured, failed
      },
      tracking: {
        number: this.generateTrackingNumber(),
        lastUpdate: new Date().toISOString()
      }
    };

    this.orders.push(order);
    this.saveOrders();

    return order;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId) {
    return this.orders.find(o => o.id === orderId);
  }

  /**
   * Get orders by customer email
   */
  getOrdersByCustomer(email) {
    return this.orders.filter(o => o.customer.email === email);
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrder(orderId);
    if (!order) return false;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      console.error('Invalid status:', newStatus);
      return false;
    }

    order.status = newStatus;
    order.tracking.lastUpdate = new Date().toISOString();
    this.saveOrders();

    return true;
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId) {
    const order = this.getOrder(orderId);
    if (!order) return false;

    if (['shipped', 'delivered'].includes(order.status)) {
      showNotification('Не можете да отмените поръчка, която е вече изпратена', 'error');
      return false;
    }

    return this.updateOrderStatus(orderId, 'cancelled');
  }

  /**
   * Generate tracking number
   */
  generateTrackingNumber() {
    return 'TRK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  /**
   * Get order statistics
   */
  getStatistics() {
    const stats = {
      total: this.orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      revenue: 0,
      avgOrderValue: 0
    };

    this.orders.forEach(order => {
      stats[order.status]++;
      stats.revenue += order.summary.grandTotal;
    });

    if (stats.total > 0) {
      stats.avgOrderValue = stats.revenue / stats.total;
    }

    return stats;
  }

  /**
   * Export orders as CSV
   */
  exportAsCSV() {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Total', 'Status'];
    const rows = this.orders.map(o => [
      o.id,
      formatDate(o.createdAt),
      `${o.customer.name} ${o.customer.surname}`,
      o.customer.email,
      formatPrice(o.summary.grandTotal),
      o.status
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csv;
  }

  /**
   * Clear old orders (older than days)
   */
  clearOldOrders(days = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const initialCount = this.orders.length;
    this.orders = this.orders.filter(o => new Date(o.createdAt) > cutoffDate);

    if (this.orders.length < initialCount) {
      this.saveOrders();
      return initialCount - this.orders.length;
    }

    return 0;
  }
}

// Global instance
const orderManager = new OrderManager();