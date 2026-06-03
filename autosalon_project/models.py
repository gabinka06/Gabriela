from dataclasses import dataclass
from typing import List, Dict

@dataclass
class Car:
    id: int
    make: str
    model: str
    year: int
    price: float

class AutoSalon:
    def __init__(self):
        self.cars: List[Car] = []

    def add_car(self, car: Car) -> None:
        """Добавя кола в инвентара."""
        self.cars.append(car)

    def remove_car_by_id(self, car_id: int) -> bool:
        """Премахва кола по `id`. Връща True ако е намерена и премахната."""
        for i, c in enumerate(self.cars):
            if c.id == car_id:
                del self.cars[i]
                return True
        return False

    def sort_by_price(self, reverse: bool = False) -> None:
        """Сортира инвентара по цена (възходящо по подразбиране)."""
        self.cars.sort(key=lambda c: c.price, reverse=reverse)

    def filter_by_make(self, make: str) -> List[Car]:
        """Връща списък с коли от дадена марка."""
        return [c for c in self.cars if c.make.lower() == make.lower()]

    def inventory_stats(self) -> Dict[str, float]:
        """Връща статистика: брой и средна цена."""
        total = len(self.cars)
        avg = sum(c.price for c in self.cars) / total if total else 0.0
        return {"total": total, "average_price": avg}

    def list_inventory(self) -> List[Car]:
        """Връща списъка с коли (инвентар)."""
        return self.cars
