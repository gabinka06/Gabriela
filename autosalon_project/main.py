from models import Car, AutoSalon


def main():
    salon = AutoSalon()

    salon.add_car(Car(1, "Toyota", "Corolla", 2018, 15000))
    salon.add_car(Car(2, "BMW", "320i", 2016, 18000))
    salon.add_car(Car(3, "Toyota", "RAV4", 2020, 25000))
    salon.add_car(Car(4, "Audi", "A4", 2019, 22000))

    print("Начален инвентар:")
    for c in salon.list_inventory():
        print(f"{c.id}: {c.make} {c.model} ({c.year}) - {c.price} лв")

    salon.sort_by_price()
    print("\nИнвентар след сортиране по цена (най-евтини първо):")
    for c in salon.list_inventory():
        print(f"{c.id}: {c.make} {c.model} - {c.price} лв")

    target_make = "Toyota"
    toyotas = salon.filter_by_make(target_make)
    print(f"\nКоли от марка {target_make}:")
    if toyotas:
        for c in toyotas:
            print(f"- {c.make} {c.model} ({c.year}) - {c.price} лв")
    else:
        print("Няма намерени коли от тази марка.")

    to_remove = None
    for c in salon.list_inventory():
        if c.price < 16000:
            to_remove = c.id
            break
    if to_remove is not None:
        removed = salon.remove_car_by_id(to_remove)
        print(f"\nПремахване на кола с id={to_remove}: {'успешно' if removed else 'неуспешно'}")

    stats = salon.inventory_stats()
    print(f"\nФинален брой коли: {stats['total']}")
    print(f"Средна цена: {stats['average_price']:.2f} лв")


if __name__ == '__main__':
    main()
