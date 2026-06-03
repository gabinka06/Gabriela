import json

# Данни за продуктите от сайта generation zef
products = [
    {"id": 1, "name": "Букет от лалета", "price": 29.99, "stock": 15},
    {"id": 2, "name": "Букет в кутия", "price": 39.99, "stock": 10},
    {"id": 3, "name": "Букет от рози", "price": 49.99, "stock": 8},
    {"id": 4, "name": "Букет Класик", "price": 35.99, "stock": 12},
    {"id": 5, "name": "Букет Весела", "price": 44.99, "stock": 6},
    {"id": 6, "name": "Букет Елегантен", "price": 54.99, "stock": 5},
    {"id": 7, "name": "Букет Романтичен", "price": 59.99, "stock": 7},
    {"id": 8, "name": "Букет Цветен", "price": 39.99, "stock": 9},
    {"id": 9, "name": "Букет Сладък", "price": 49.99, "stock": 11},
    {"id": 10, "name": "Букет Традиционен", "price": 34.99, "stock": 14},
    {"id": 11, "name": "Букет Вебп", "price": 37.99, "stock": 4}
]

def show_stock():
    print("Складова наличност за продуктите на generation zef:")
    print("-" * 60)
    for product in products:
        status = "В наличност" if product["stock"] > 0 else "Изчерпан"
        print(f"ID: {product['id']}, Име: {product['name']}, Цена: {product['price']} лв, Наличност: {product['stock']} бр. - {status}")
    print("-" * 60)
    total_stock = sum(p["stock"] for p in products)
    print(f"Обща наличност: {total_stock} броя")

def check_product_stock(product_id):
    product = next((p for p in products if p["id"] == product_id), None)
    if product:
        return product["stock"]
    else:
        return None

if __name__ == "__main__":
    show_stock()
    print("\nПроверка за продукт с ID 1:")
    stock = check_product_stock(1)
    if stock is not None:
        print(f"Наличност: {stock} бр.")
    else:
        print("Продуктът не е намерен.")