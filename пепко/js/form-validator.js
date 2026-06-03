/**
 * Form Validation Module
 * Centralized validation for all forms
 */

class FormValidator {
  /**
   * Validate customer checkout form
   */
  static validateCheckoutForm() {
    const name = document.getElementById('cust-name')?.value.trim();
    const surname = document.getElementById('cust-surname')?.value.trim();
    const email = document.getElementById('cust-email')?.value.trim();
    const phone = document.getElementById('cust-phone')?.value.trim();
    const address = document.getElementById('cust-address')?.value.trim();

    const errors = [];

    if (!name) errors.push('Име е задължително');
    if (!surname) errors.push('Фамилия е задължителна');

    if (!email) {
      errors.push('Имейл е задължителен');
    } else if (!isValidEmail(email)) {
      errors.push('Имейлът не е валиден');
    }

    if (!phone) {
      errors.push('Телефон е задължителен');
    } else if (!isValidPhone(phone)) {
      errors.push('Телефонът не е валиден (например: +359 88 1234567)');
    }

    const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
    if (delivery === 'address' && !address) {
      errors.push('Адресата е задължителна при доставка до адрес');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate card payment form
   */
  static validateCardForm() {
    const name = document.getElementById('card-name')?.value.trim();
    const number = document.getElementById('card-number')?.value.replace(/\s/g, '');
    const expiry = document.getElementById('card-expiry')?.value.trim();
    const cvv = document.getElementById('card-cvv')?.value.trim();

    const errors = [];

    if (!name) errors.push('Име на картодържателя е задължително');

    if (!number || number.length < 12) {
      errors.push('Номерът на картата трябва да е минимум 12 цифри');
    } else if (!/^\d+$/.test(number)) {
      errors.push('Номерът на картата трябва да съдържа само цифри');
    }

    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      errors.push('Дата на валидност (MM/YY) е невалидна');
    }

    if (!cvv || !/^\d{3,4}$/.test(cvv)) {
      errors.push('CVV трябва да е 3 или 4 цифри');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Show validation errors
   */
  static showErrors(errors) {
    if (errors.length === 0) return;

    const message = errors.join('\n');
    showNotification(message, 'error', 5000);
  }

  /**
   * Validate required field
   */
  static isRequired(value) {
    return value && value.trim().length > 0;
  }

  /**
   * Validate field length
   */
  static minLength(value, min) {
    return value && value.length >= min;
  }

  /**
   * Validate field matches pattern
   */
  static matches(value, pattern) {
    return pattern.test(value);
  }
}