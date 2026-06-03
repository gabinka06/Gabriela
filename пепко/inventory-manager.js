// Управление на складова наличност във клиентската страна

// Инициализиране на инвентара от localStorage
function initializeInventory() {
    let inventory = localStorage.getItem('warehouse_inventory');
    if (!inventory) {
        return loadInventoryFromJson();
    }

    const storedInventory = JSON.parse(inventory);
    // Опитваме се да синхронизираме с inventory.json за изчерпани продукти,
    // за да се обнови наличността след ръчно редактиране на файла.
    syncInventoryWithJson(storedInventory);
    return JSON.parse(localStorage.getItem('warehouse_inventory'));
}

function loadInventoryFromJson() {
    const defaultInventory = {
        "1": 15, "2": 10, "3": 8, "4": 12, "5": 6,
        "6": 5, "7": 7, "8": 9, "9": 11, "10": 14, "11": 4
    };

    if (window.fetch) {
        fetch('inventory.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('inventory.json не може да се зареди');
                }
                return response.json();
            })
            .then(data => {
                const inventoryData = {};
                if (Array.isArray(data.products)) {
                    data.products.forEach(p => {
                        inventoryData[p.id] = p.stock;
                    });
                }
                localStorage.setItem('warehouse_inventory', JSON.stringify(inventoryData));
            })
            .catch(() => {
                localStorage.setItem('warehouse_inventory', JSON.stringify(defaultInventory));
            });
        return defaultInventory;
    }

    localStorage.setItem('warehouse_inventory', JSON.stringify(defaultInventory));
    return defaultInventory;
}

function syncInventoryWithJson(storedInventory) {
    if (!window.fetch) {
        return;
    }

    fetch('inventory.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('inventory.json не може да се зареди');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.products)) {
                return;
            }
            let updated = false;
            const mergedInventory = { ...storedInventory };
            data.products.forEach(p => {
                const id = String(p.id);
                const adminStock = Number(p.stock) || 0;
                const storedStock = Number(mergedInventory[id]) || 0;
                if (storedStock === 0 && adminStock > 0) {
                    mergedInventory[id] = adminStock;
                    updated = true;
                }
            });
            if (updated) {
                localStorage.setItem('warehouse_inventory', JSON.stringify(mergedInventory));
                updateAllStockDisplay();
            }
        })
        .catch(() => {});
}

// Вземане на наличност за продукт
function getStockForProduct(productId) {
    const inventory = initializeInventory();
    return inventory[productId] || 0;
}

// Показване на наличност на продукт
function displayStockInfo(productId, elementId) {
    const stock = getStockForProduct(productId);
    const element = document.getElementById(elementId);
    if (element) {
        const statusClass = stock > 0 ? 'stock-available' : 'stock-unavailable';
        const statusText = stock > 0 ? `✓ В наличност: ${stock} бр.` : 'Изчерпан';
        element.textContent = statusText;
        element.className = statusClass;
    }
}

// Намаляване на наличност при поръчка
function decreaseStock(productId, quantity) {
    const inventory = initializeInventory();
    const currentStock = inventory[productId] || 0;
    
    if (currentStock < quantity) {
        return false; // Няма достатъчно наличност
    }
    
    inventory[productId] = currentStock - quantity;
    localStorage.setItem('warehouse_inventory', JSON.stringify(inventory));
    updateAllStockDisplay(); // Обновяване на дисплея
    return true;
}

// Обработка на поръчка
function processOrder(cartItems) {
    // Проверка дали има достатъчна наличност
    for (let item of cartItems) {
        const stock = getStockForProduct(item.id);
        if (stock < item.quantity) {
            return {
                success: false,
                message: `Недостатъчна наличност за ${item.name}. Наличност: ${stock} бр.`
            };
        }
    }
    
    // Намаляване на наличност за всеки артикул
    for (let item of cartItems) {
        decreaseStock(item.id, item.quantity);
    }
    
    return {
        success: true,
        message: "Наличност актуализирана успешно"
    };
}

// Экспортиране на инвентара (за Python анализ)
function exportInventoryData() {
    const inventory = initializeInventory();
    return JSON.stringify(inventory, null, 2);
}

// Синхронизиране на инвентара със сайта
function updateInventoryDisplay() {
    // Обновяване на всички елементи с наличност
    const stockElements = document.querySelectorAll('[data-product-id]');
    stockElements.forEach(element => {
        const productId = element.getAttribute('data-product-id');
        const stock = getStockForProduct(productId);
        element.textContent = stock > 0 ? `${stock} бр.` : 'Изчерпан';
        element.className = stock > 0 ? 'stock-available' : 'stock-unavailable';
    });
}

// Новo: Обновяване на наличност за всички продукти на сайта
function updateAllStockDisplay() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = card.getAttribute('data-id');
        const stock = getStockForProduct(productId);
        
        // Намиране или създаване на елемента за наличност
        let stockEl = card.querySelector('.product-stock');
        if (!stockEl) {
            stockEl = document.createElement('div');
            stockEl.className = 'product-stock';
            const priceEl = card.querySelector('.product-price');
            if (priceEl) {
                priceEl.parentNode.insertBefore(stockEl, priceEl.nextSibling);
            }
        }
        
        if (stock > 0) {
            stockEl.textContent = `📦 Наличност: ${stock} бр.`;
            stockEl.className = 'product-stock stock-available';
        } else {
            stockEl.textContent = '❌ Изчерпан';
            stockEl.className = 'product-stock stock-unavailable';
        }
    });
}

// Автоматично обновяване при зареждане на страницата
document.addEventListener('DOMContentLoaded', function() {
    updateAllStockDisplay();
});

// Обновяване всеки път когато се промени localStorage
window.addEventListener('storage', function() {
    updateAllStockDisplay();
});
