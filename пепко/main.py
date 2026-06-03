from models import Warehouse

def main():
    warehouse = Warehouse()

    if not warehouse.products:
        warehouse.add_product(1, "Букет от лалета", 29.99, 19)
        warehouse.add_product(2, "Букет в кутия", 39.99, 10)
        warehouse.add_product(3, "Букет от рози", 49.99, 8)
        warehouse.add_product(4, "Букет Класик", 35.99, 12)
        warehouse.add_product(5, "Букет Весела", 44.99, 6)
        warehouse.add_product(6, "Букет Елегантен", 54.99, 5)
        warehouse.add_product(7, "Букет Романтичен", 59.99, 7)
        warehouse.add_product(8, "Букет Цветен", 39.99, 9)
        warehouse.add_product(9, "Букет Сладък", 49.99, 11)
        warehouse.add_product(10, "Букет Традиционен", 34.99, 14)
        warehouse.add_product(11, "Букет Вебп", 37.99, 4)

    print("=" * 60)
    print("Продукти в склада:")
    print("=" * 60)
    warehouse.display_products()

    print("\nОбща наличност:", warehouse.get_total_stock(), "броя")

    stock = warehouse.check_stock(1)
    if stock is not None:
        print(f"\nНаличност за продукт ID 1: {stock} бр.")
    else:
        print("\nПродуктът не е намерен.")

    print("\n" + "=" * 60)
    print("ДЕМОНСТРАЦИЯ HA ПОРЪЧKA")
    print("=" * 60)
    
    test_order = [
        {"id": 1, "name": "Букет от лалета", "price": 29.99, "quantity": 2},
        {"id": 3, "name": "Букет от рози", "price": 49.99, "quantity": 1}
    ]
    
    print(f"\nПоръчка: {len(test_order)} артикула")
    for item in test_order:
        print(f"  - {item['name']} x {item['quantity']} бр.")
    
    success, message = warehouse.process_order(test_order)
    print(f"Резултат: {message}")
    
    if success:
        print("\nНаличност ПО обработка на поръчката:")
        warehouse.display_products()
    
    print("\n" + "=" * 60)
    print("Продукти сортирани по цена:")
    print("=" * 60)
    warehouse.sort_products_by_price()
    warehouse.display_products()

    print("\n" + "=" * 60)
    print("Продукти сортирани по наличност (низходящо):")
    print("=" * 60)
    warehouse.sort_products_by_stock()
    warehouse.display_products()

    low_stock = warehouse.find_low_stock(5)
    print(f"\n" + "=" * 60)
    print(f"Продукти с наличност <= 5 бр.:")
    print("=" * 60)
    for product in low_stock:
        print(f"ID: {product['id']}, Име: {product['name']}, Наличност: {product['stock']} бр.")

if __name__ == "__main__":
    main()