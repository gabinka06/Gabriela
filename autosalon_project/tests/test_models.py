from models import Car, AutoSalon


def test_add_and_list():
    salon = AutoSalon()
    salon.add_car(Car(1, 'Toyota', 'Corolla', 2018, 15000))
    assert len(salon.list_inventory()) == 1


def test_sort_by_price():
    salon = AutoSalon()
    salon.add_car(Car(1, 'A', 'a', 2010, 20000))
    salon.add_car(Car(2, 'B', 'b', 2011, 10000))
    salon.sort_by_price()
    assert salon.list_inventory()[0].price == 10000


def test_filter_by_make():
    salon = AutoSalon()
    salon.add_car(Car(1, 'Toyota', 'C1', 2010, 10000))
    salon.add_car(Car(2, 'BMW', 'C2', 2011, 20000))
    res = salon.filter_by_make('toyota')
    assert len(res) == 1 and res[0].make == 'Toyota'


def test_remove_car_by_id():
    salon = AutoSalon()
    salon.add_car(Car(1, 'X', 'x', 2012, 5000))
    assert salon.remove_car_by_id(1) is True
    assert len(salon.list_inventory()) == 0
