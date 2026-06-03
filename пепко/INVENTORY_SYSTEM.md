ИНТЕГРАЦИЯ НА СКЛАДОВА НАЛИЧНОСТ - ИНСТРУКЦИИ

===== НОВИ ФАЙЛОВЕ =====

1. inventory.json
   - JSON база данни със всички продукти и тяхната наличност
   - Автоматично се актуализира при всяка поръчка
   - Структура: {"products": [{"id": 1, "name": "...", "price": ..., "stock": ...}]}

2. inventory-manager.js
   - JavaScript функции за управление на наличност на клиентската страна
   - Съхранява наличност в localStorage
   - Основни функции:
     * initializeInventory() - инициализира инвентара
     * getStockForProduct(productId) - вземa наличност
     * decreaseStock(productId, quantity) - намалява наличност
     * processOrder(cartItems) - обработва поръчка

3. Актуализирани файлове:
   - models.py - добавени методи за work с inventory.json
   - main.py - демонстрация на processOrder
   - checkout-failsafe.js - интеграция с processOrder
   - new 1.html - включен inventory-manager.js
   - cart.html - включен inventory-manager.js

===== КАК РАБОТИ =====

1. НАЧАЛО:
   - При първо зареждане на сайта, inventory-manager.js инициализира инвентара от localStorage
   - Ако нямаше преди, се използват стойности по подразбиране

2. ПОКАЗВАНЕ НА НАЛИЧНОСТ:
   - JavaScript показва наличност на всеки продукт
   - При попълване на количката, се проверява дема имаме достатъчно

3. ПОРЪЧКА И АКТУАЛИЗАЦИЯ:
   - При финализиране на поръчка (checkout), processOrder() намалява наличност
   - Намалената наличност се пази в localStorage
   - Следващия път когато зареждаме сайта, видим актуализирани стойности

4. PYTHON УПРАВЛЕНИЕ:
   - За администриране: python main.py
   - Това актуализира inventory.json и показва цялата наличност
   - Можете да добавяте/премахвате продукти или да обработвате поръчки

===== ПРИМЕРИ =====

JAVASCRIPT ИНТЕГРАЦИЯ:
```javascript
// Вземане на наличност
let stock = getStockForProduct(1); // ID на продукт

// Обработка на поръчка
let result = processOrder([
  {id: 1, name: "Букет", quantity: 2},
  {id: 3, name: "Букет", quantity: 1}
]);
if (result.success) {
  console.log("Поръчката е обработена!");
} else {
  console.log("Грешка: " + result.message);
}
```

PYTHON УПРАВЛЕНИЕ:
```python
from models import Warehouse

warehouse = Warehouse()
warehouse.process_order([
  {"id": 1, "quantity": 2},
  {"id": 3, "quantity": 1}
])
warehouse.display_products()
```

===== ПОСЛЕДОВАТЕЛНОСТ НА СЪБИТИЯТА =====

При поръчка:
1. Клиент добавя産якти в количката
2. При checkout, JavaScript проверява наличност
3. Ако има достатъчно, processOrder() намалява наличност в localStorage
4. Поръчката се пази в lastOrder
5. Клиентът вижда потвърждението

При следващо посещение на сайта:
1. inventory-manager.js чете localStorage
2. Показва актуализирана наличност
3. Нови поръчки работят със обновена наличност

При администриране (Python):
1. Стартирам main.py
2. Той чита от inventory.json
3. Показва наличност и позволява операции
4. Записва промените обратно в inventory.json
