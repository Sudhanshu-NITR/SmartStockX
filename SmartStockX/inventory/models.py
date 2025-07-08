from django.db import models
from django.utils import timezone


class Store(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    contact_email = models.EmailField()

    def _str_(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)

    def _str_(self):
        return self.name


class Inventory(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='inventories')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventories')

    stock = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # MRP
    days_to_expiry = models.IntegerField(default=0)
    shelf_life_days = models.PositiveIntegerField()

    units_sold = models.PositiveIntegerField(default=0)
    avg_daily_sales = models.FloatField(default=0.0)

    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('store', 'product', 'days_to_expiry')

    def _str_(self):
        return f"{self.product.name} @ {self.store.name}"

    @property
    def remaining_ratio(self):
        return self.days_to_expiry / max(self.shelf_life_days, 1)

    @property
    def expected_sales(self):
        return self.avg_daily_sales * self.days_to_expiry

    @property
    def surplus(self):
        return max(self.stock - self.expected_sales, 0)

    def compute_discount(self, base=0.10, max_disc=0.40, abs_days_threshold=2):
        unsold_units = max(self.stock - self.expected_sales, 0)
        unsold_ratio = unsold_units / self.stock if self.stock else 0

        urgency_rel = 1 - self.remaining_ratio
        urgency_abs = max((abs_days_threshold - self.days_to_expiry + 1), 0) / abs_days_threshold

        urgency = max(urgency_rel, urgency_abs)
        dynamic = 0.5 * unsold_ratio * urgency
        discount = min(max_disc, base + dynamic)
        return round(discount, 2)

    def final_price(self):
        discount = self.compute_discount()
        return round(float(self.price) * (1 - discount), 2)

