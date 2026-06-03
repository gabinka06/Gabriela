/**
 * Utility functions for generation zef
 * Centralized helper functions used across the application
 */

const EUR_RATE = 1.95583;
const DELIVERY_FEES_BGN = {
  office: Number((4 * EUR_RATE).toFixed(2)),
  address: Number((6 * EUR_RATE).toFixed(2))
};

/**
 * Safely parse JSON with fallback
 */
function safeParse(value, fallback = null) {
  try {
    const parsed = JSON.parse(value);
    return parsed == null ? fallback : parsed;
  } catch (e) {
    console.warn('JSON parse error:', e);
    return fallback;
  }
}

/**
 * Format price with dual currency (BGN / EUR)
 */
function formatDualPrice(amount) {
  const bgn = Number(amount) || 0;
  const eur = bgn / EUR_RATE;
  return `${bgn.toFixed(2)} лв / €${eur.toFixed(2)}`;
}

/**
 * Format simple price
 */
function formatPrice(amount) {
  return Number(amount || 0).toFixed(2);
}

/**
 * Sanitize HTML to prevent XSS
 */
function sanitizeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validate email
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (Bulgarian format)
 */
function isValidPhone(phone) {
  const re = /^(\+359|0)[0-9]{8,9}$/;
  return re.test(phone.replace(/\s/g, ''));
}

/**
 * Debounce function for performance
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Format date to Bulgarian locale
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate order ID
 */
function generateOrderId() {
  return '#' + Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `notification notification-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Local storage wrapper with error handling
 */
const Storage = {
  get(key, fallback = null) {
    try {
      return safeParse(localStorage.getItem(key), fallback);
    } catch (e) {
      console.error('Storage get error:', e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      showNotification('Грешка при запазване на данни', 'error');
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  }
};

export {
  EUR_RATE,
  DELIVERY_FEES_BGN,
  safeParse,
  formatDualPrice,
  formatPrice,
  sanitizeHtml,
  isValidEmail,
  isValidPhone,
  debounce,
  formatDate,
  generateOrderId,
  showNotification,
  Storage
};