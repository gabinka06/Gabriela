import json
import os

class Warehouse:
    def __init__(self, inventory_file="inventory.json"):
        self.inventory_file = inventory_file
        self.products = self.load_from_file()

    def load_from_file(self):
        if os.path.exists(self.inventory_file):
            with open(self.inventory_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('products', [])
        return []

    def save_to_file(self):
        with open(self.inventory_file, 'w', encoding='utf-8') as f:
            json.dump({"products": self.products}, f, ensure_ascii=False, indent=2)

    def add_product(self, product_id, name, price, stock):
        product = {
            "id": product_id,
            "name": name,
            "price": price,
            "stock": stock
        }
        self.products.append(product)
        self.save_to_file()

    def remove_product(self, product_id):
        self.products = [p for p in self.products if p["id"] != product_id]
        self.save_to_file()

    def update_stock(self, product_id, quantity):
        """Актуализира наличност (намалява или увеличава)"""
        for product in self.products:
            if product["id"] == product_id:
                product["stock"] += quantity
                self.save_to_file()
                return product["stock"]
        return None

    def check_stock(self, product_id):
        for product in self.products:
            if product["id"] == product_id:
                return product["stock"]
        return None

    def sort_products_by_price(self):
        self.products.sort(key=lambda p: p["price"])

    def sort_products_by_stock(self):
        self.products.sort(key=lambda p: p["stock"], reverse=True)

    def get_total_stock(self):
        total = 0
        for product in self.products:
            total += product["stock"]
        return total

    def display_products(self):
        for product in self.products:
            status = "В наличност" if product["stock"] > 0 else "Изчерпан"
            print(f"ID: {product['id']}, Име: {product['name']}, Цена: {product['price']} лв, Наличност: {product['stock']} бр. - {status}")

    def find_low_stock(self, threshold=5):
        low_stock_products = []
        for product in self.products:
            if product["stock"] <= threshold:
                low_stock_products.append(product)
        return low_stock_products

    def process_order(self, cart_items):
        """Обработва поръчка и намалява наличност. Връща True ако успешно, False ако няма достатъчно наличност"""
        for item in cart_items:
            product_id = item.get("id")
            quantity = item.get("quantity", 1)
            
            for product in self.products:
                if product["id"] == product_id:
                    if product["stock"] < quantity:
                        return False, f"Недостатъчна наличност за {product['name']}"
                    break
        
        # Ако всички продукти имат достатъчна наличност, намалете запасите
        for item in cart_items:
            product_id = item.get("id")
            quantity = item.get("quantity", 1)
            self.update_stock(product_id, -quantity)
        
        return True, "Поръчката е обработена успешно"

    def export_inventory_json(self):
        """Експортира инвентара като JSON за клиентската страна"""
        return json.dumps({"products": self.products}, ensure_ascii=False, indent=2)

    def add_stock(self, product_id, quantity):
        """Добавя наличност към продукт"""
        for product in self.products:
            if product["id"] == product_id:
                product["stock"] += quantity
                self.save_to_file()
                return product["stock"]
        return None

    def set_stock(self, product_id, quantity):
        """Задава точно количество наличност"""
        for product in self.products:
            if product["id"] == product_id:
                product["stock"] = quantity
                self.save_to_file()
                return product["stock"]
        return None